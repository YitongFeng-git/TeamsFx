// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

import {
  commands,
  Uri,
  window,
  workspace,
  ExtensionContext,
  env,
  ViewColumn,
  ProgressLocation,
  debug
} from "vscode";
import {
  Result,
  FxError,
  err,
  ok,
  Stage,
  ConfigMap,
  Platform,
  Func,
  UserError,
  SystemError,
  returnUserError,
  returnSystemError
} from "teamsfx-api";
import { CoreProxy } from "teamsfx-core";
import DialogManagerInstance from "./userInterface";
import GraphManagerInstance from "./commonlib/graphLogin";
import AzureAccountManager from "./commonlib/azureLogin";
import AppStudioTokenInstance from "./commonlib/appStudioLogin";
import VsCodeLogInstance from "./commonlib/log";
import { VSCodeTelemetryReporter } from "./commonlib/telemetry";
import { CommandsTreeViewProvider, TreeViewCommand } from "./commandsTreeViewProvider";
import * as extensionPackage from "./../package.json";
import { ext } from "./extensionVariables";
import { traverse } from "./question/question";
import { ExtTelemetry } from "./telemetry/extTelemetry";
import {
  TelemetryEvent,
  TelemetryProperty,
  TelemetryTiggerFrom,
  TelemetrySuccess
} from "./telemetry/extTelemetryEvents";
import { InputResult, InputResultType } from "./question/types";
import * as commonUtils from "./debug/commonUtils";
import { ExtensionErrors, ExtensionSource } from "./error";
import { WebviewPanel } from "./controls/webviewPanel";
import { tryValidateFuncCoreToolsInstalled } from "./debug/funcCoreTools/validateFuncCoreToolsInstalled";
import {
  dotnetCheckerEnabled,
  tryValidateDotnetInstalled
} from "./debug/dotnetSdk/dotnetCheckerAdapter";
import { DotnetChecker } from "./debug/dotnetSdk/dotnetChecker";
import * as constants from "./debug/constants";
import logger from "./commonlib/log";
import { isFeatureFlag } from "./utils/commonUtils";
import { cpUtils } from "./debug/cpUtils";
import * as path from "path";
import * as fs from "fs-extra";

export let core: CoreProxy;
const runningTasks = new Set<string>(); // to control state of task execution

export async function activate(): Promise<Result<null, FxError>> {
  const result: Result<null, FxError> = ok(null);
  try {
    core = CoreProxy.getInstance();

    {
      const result = await core.withDialog(DialogManagerInstance);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const result = await core.withGraphToken(GraphManagerInstance);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const result = await core.withAzureAccount(AzureAccountManager);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const result = await core.withAppStudioToken(AppStudioTokenInstance);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const telemetry = new VSCodeTelemetryReporter(
        extensionPackage.aiKey,
        extensionPackage.name,
        extensionPackage.version
      );
      const result = await core.withTelemetry(telemetry);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const result = await core.withLogger(VsCodeLogInstance);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const result = await core.withTreeProvider(CommandsTreeViewProvider.getInstance());
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const globalConfig = new ConfigMap();
      globalConfig.set("featureFlag", isFeatureFlag());
      globalConfig.set("function-dotnet-checker-enabled", dotnetCheckerEnabled());
      const result = await core.init(globalConfig);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }

    {
      const workspacePath: string | undefined = workspace.workspaceFolders?.length
        ? workspace.workspaceFolders[0].uri.fsPath
        : undefined;
      const result = await core.open(workspacePath);
      if (result.isErr()) {
        showError(result.error);
        return err(result.error);
      }
    }
  } catch (e) {
    const FxError: FxError = {
      name: e.name,
      source: ExtensionSource,
      message: e.message,
      stack: e.stack,
      timestamp: new Date()
    };
    showError(FxError);
    return err(FxError);
  }
  return result;
}

export async function createNewProjectHandler(args?: any[]): Promise<Result<null, FxError>> {
  ExtTelemetry.sendTelemetryEvent(TelemetryEvent.CreateProjectStart, {
    [TelemetryProperty.TriggerFrom]:
      args && args[0] === CommandsTreeViewProvider.TreeViewFlag
        ? TelemetryTiggerFrom.TreeView
        : TelemetryTiggerFrom.CommandPalette
  });
  return await runCommand(Stage.create);
}

export async function updateProjectHandler(): Promise<Result<null, FxError>> {
  ExtTelemetry.sendTelemetryEvent(TelemetryEvent.UpdateProjectStart, {
    [TelemetryProperty.TriggerFrom]: TelemetryTiggerFrom.CommandPalette
  });
  return await runCommand(Stage.update);
}

export async function provisionHandler(): Promise<Result<null, FxError>> {
  ExtTelemetry.sendTelemetryEvent(TelemetryEvent.ProvisionStart, {
    [TelemetryProperty.TriggerFrom]: TelemetryTiggerFrom.CommandPalette
  });
  return await runCommand(Stage.provision);
}

export async function deployHandler(): Promise<Result<null, FxError>> {
  ExtTelemetry.sendTelemetryEvent(TelemetryEvent.DeployStart, {
    [TelemetryProperty.TriggerFrom]: TelemetryTiggerFrom.CommandPalette
  });
  return await runCommand(Stage.deploy);
}

async function runCommand(stage: Stage): Promise<Result<null, FxError>> {
  const eventName = ExtTelemetry.stageToEvent(stage);
  let result: Result<null, FxError> = ok(null);

  try {
    // 1. check concurrent lock
    if (runningTasks.size > 0 && stage !== Stage.create) {
      result = err(
        new UserError(
          ExtensionErrors.ConcurrentTriggerTask,
          `task '${Array.from(runningTasks).join(",")}' is still running, please wait!`,
          ExtensionSource
        )
      );
      await processResult(eventName, result);
      return result;
    }

    // 2. lock
    runningTasks.add(stage);

    // 3. check core not empty
    const checkCoreRes = checkCoreNotEmpty();
    if (checkCoreRes.isErr()) {
      throw checkCoreRes.error;
    }

    const answers = new ConfigMap();
    answers.set("stage", stage);

    // 4. getQuestions
    const qres = await core.getQuestions(stage, Platform.VSCode);
    if (qres.isErr()) {
      throw qres.error;
    }

    // 5. run question model
    const node = qres.value;
    if (node) {
      VsCodeLogInstance.info(`Question tree:${JSON.stringify(node, null, 4)}`);
      answers.set("substage", "askQuestions");
      const res: InputResult = await traverse(node, answers, ext.visit);
      VsCodeLogInstance.info(`User input:${JSON.stringify(res, null, 4)}`);
      if (res.type === InputResultType.error) {
        throw res.error!;
      } else if (res.type === InputResultType.cancel) {
        throw new UserError(ExtensionErrors.UserCancel, "User Cancel", ExtensionSource);
      }
    }

    // 6. run task
    answers.set("substage", "runTask");
    if (stage === Stage.create) result = await core.create(answers);
    else if (stage === Stage.update) result = await core.update(answers);
    else if (stage === Stage.provision) result = await core.provision(answers);
    else if (stage === Stage.deploy) result = await core.deploy(answers);
    else if (stage === Stage.debug) result = await core.localDebug(answers);
    else {
      throw new SystemError(
        ExtensionErrors.UnsupportedOperation,
        `Operation not support:${stage}`,
        ExtensionSource
      );
    }
  } catch (e) {
    result = wrapError(e);
  }

  // 7. unlock
  runningTasks.delete(stage);

  // 8. send telemetry and show error
  await processResult(eventName, result);

  return result;
}

async function runUserTask(func: Func): Promise<Result<null, FxError>> {
  const eventName = func.method;
  let result: Result<null, FxError> = ok(null);

  try {
    // 1. check concurrent lock
    if (runningTasks.size > 0) {
      result = err(
        new UserError(
          ExtensionErrors.ConcurrentTriggerTask,
          `task '${Array.from(runningTasks).join(",")}' is still running, please wait!`,
          ExtensionSource
        )
      );
      await processResult(eventName, result);
      return result;
    }

    // 2. lock
    runningTasks.add(eventName);

    // 3. check core not empty
    const checkCoreRes = checkCoreNotEmpty();
    if (checkCoreRes.isErr()) {
      throw checkCoreRes.error;
    }

    const answers = new ConfigMap();
    answers.set("task", eventName);

    // 4. getQuestions
    const qres = await core.getQuestionsForUserTask(func, Platform.VSCode);
    if (qres.isErr()) {
      throw qres.error;
    }

    // 5. run question model
    const node = qres.value;
    if (node) {
      VsCodeLogInstance.info(`Question tree:${JSON.stringify(node, null, 4)}`);
      const res: InputResult = await traverse(node, answers, ext.visit);
      VsCodeLogInstance.info(`User input:${JSON.stringify(res, null, 4)}`);
      if (res.type === InputResultType.error) {
        throw res.error!;
      } else if (res.type === InputResultType.cancel) {
        throw new UserError(ExtensionErrors.UserCancel, "User Cancel", ExtensionSource);
      }
    }

    // 6. run task
    result = await core.executeUserTask(func, answers);
  } catch (e) {
    result = wrapError(e);
  }

  // 7. unlock
  runningTasks.delete(eventName);

  // 8. send telemetry and show error
  await processResult(eventName, result);

  return result;
}

//TODO workaround
function isCancelWarning(error: FxError): boolean {
  return (
    (!!error.name && error.name === ExtensionErrors.UserCancel) ||
    (!!error.message && error.message.includes("User Cancel"))
  );
}
//TODO workaround
function isLoginFaiureError(error: FxError): boolean {
  return !!error.message && error.message.includes("Cannot get user login information");
}

async function processResult(eventName: string, result: Result<null, FxError>) {
  if (result.isErr()) {
    ExtTelemetry.sendTelemetryErrorEvent(eventName, result.error);
    const error = result.error;
    if (isCancelWarning(error)) {
      // window.showWarningMessage(`Operation is canceled!`);
      return;
    }
    if (isLoginFaiureError(error)) {
      window.showErrorMessage(`Login failed, the operation is terminated.`);
      return;
    }
    showError(error);
  } else {
    ExtTelemetry.sendTelemetryEvent(eventName, {
      [TelemetryProperty.Success]: TelemetrySuccess.Yes
    });
  }
}

function wrapError(e: Error): Result<null, FxError> {
  if (
    e instanceof UserError ||
    e instanceof SystemError ||
    (e.constructor &&
      e.constructor.name &&
      (e.constructor.name === "SystemError" || e.constructor.name === "UserError"))
  ) {
    return err(e as FxError);
  }
  return err(returnSystemError(e, ExtensionSource, ExtensionErrors.UnknwonError));
}

function checkCoreNotEmpty(): Result<null, SystemError> {
  if (!core) {
    return err(
      returnSystemError(
        new Error("Core module is not ready!\n Can't do other actions!"),
        ExtensionSource,
        ExtensionErrors.UnsupportedOperation
      )
    );
  }
  return ok(null);
}

/**
 * manually added customized command
 */
export async function updateAADHandler(): Promise<Result<null, FxError>> {
  ExtTelemetry.sendTelemetryEvent(TelemetryEvent.UpdateAadStart, {
    [TelemetryProperty.TriggerFrom]: TelemetryTiggerFrom.CommandPalette
  });
  const func: Func = {
    namespace: "teamsfx-solution-azure/teamsfx-plugin-aad-app-for-teams",
    method: "aadUpdatePermission"
  };
  return await runUserTask(func);
}

/**
 * check & install required dependencies during local debug.
 */
export async function validateDependenciesHandler(): Promise<void> {
  let shouldContinue = true;
  if (shouldContinue && (await commonUtils.hasTeamsfxBackend())) {
    shouldContinue = await tryValidateFuncCoreToolsInstalled();
  }

  if (shouldContinue) {
    shouldContinue = await tryValidateDotnetInstalled();
  }
}

/**
 * install functions binding before launch local debug
 */
export async function backendExtensionsInstallHandler(): Promise<void> {
  let dotnetExecPath;
  if (dotnetCheckerEnabled()) {
    dotnetExecPath = await DotnetChecker.getDotnetExecPath();
  } else {
    dotnetExecPath = "dotnet";
  }

  if (!dotnetExecPath) {
    logger.error(`Failed to run backend extension install, .NET SDK executable not found`);
    commonUtils.displayLearnMore(
      constants.Messages.failToInstallBackendExtensions,
      constants.backendExtensionsHelpLink
    );
    await debug.stopDebugging();
    return;
  }

  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    const workspaceFolder = workspace.workspaceFolders[0];
    const backendRoot = await commonUtils.getProjectRoot(
      workspaceFolder.uri.fsPath,
      constants.backendFolderName
    );

    try {
      await cpUtils.executeCommand(
        backendRoot,
        logger,
        { shell: false },
        dotnetExecPath,
        "build",
        "-o",
        "bin"
      );
    } catch (error) {
      logger.error(`Failed to run backend extension install: error = '${error}'`);
      commonUtils.displayLearnMore(
        constants.Messages.failToInstallBackendExtensions,
        constants.backendExtensionsHelpLink
      );
      await debug.stopDebugging();
      return;
    }
  }
}

/**
 * call localDebug on core, then call customized function to return result
 */
export async function preDebugCheckHandler(): Promise<void> {
  let result: Result<any, FxError> = ok(null);

  // try {
  // TODO(kuojianlu): improve the check
  const authLocalEnv = await commonUtils.getAuthLocalEnv();
  const clientID = authLocalEnv ? authLocalEnv["CLIENT_ID"] : undefined;
  if (clientID === undefined) {
    result = await runCommand(Stage.debug);
  }
  if (result.isErr()) {
    throw result.error;
  }
  // } catch (e) {
  //   result = wrapError(e);
  //   const eventName = ExtTelemetry.stageToEvent(Stage.debug);
  //   await processResult(eventName, result);
  //   // If debug stage fails, throw error to terminate the debug process
  //   throw result;
  // }
}

export async function mailtoHandler(): Promise<boolean> {
  return env.openExternal(
    Uri.parse("https://github.com/OfficeDev/teamsfx/issues/new")
  );
}

export async function openDocumentHandler(): Promise<boolean> {
  return env.openExternal(Uri.parse("https://github.com/OfficeDev/teamsfx/"));
}

export async function devProgramHandler(): Promise<boolean> {
  return env.openExternal(
    Uri.parse("https://developer.microsoft.com/en-us/microsoft-365/dev-program")
  );
}

export async function openWelcomeHandler() {
  const welcomePanel = window.createWebviewPanel("react", "Teams Toolkit", ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: true
  });
  welcomePanel.webview.html = getHtmlForWebview();

  //WebviewPanel.createOrShow(ext.context.extensionPath);
}

export async function openManifestHandler(): Promise<Result<null, FxError>> {
  ExtTelemetry.sendTelemetryEvent(TelemetryEvent.OpenManifestEditor, {
    [TelemetryProperty.TriggerFrom]: TelemetryTiggerFrom.TreeView
  });
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    const workspaceFolder = workspace.workspaceFolders[0];
    const configRoot = await commonUtils.getProjectRoot(
      workspaceFolder.uri.fsPath,
      constants.teamsfxFolderName
    );
    const manifestFile = `${configRoot}/${constants.manifestFileName}`;
    if (fs.existsSync(manifestFile)) {
      workspace.openTextDocument(manifestFile).then((document) => {
        window.showTextDocument(document);
      });
      return ok(null);
    } else {
      const FxError: FxError = {
        name: "FileNotFound",
        source: ExtensionSource,
        message: `${manifestFile} not found, cannot open it.`,
        timestamp: new Date()
      };
      showError(FxError);
      return err(FxError);
    }
  } else {
    const FxError: FxError = {
      name: "NoWorkspace",
      source: ExtensionSource,
      message: `No open workspace`,
      timestamp: new Date()
    };
    showError(FxError);
    return err(FxError);
  }
}

// TODO: remove this once welcome page is ready
function getHtmlForWebview() {
  return `<!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8" />
    <title>Teams Toolkit</title>
  </head>

  <body>
    <div class="message-container">
      <div class="message">
        Coming Soon...
      </div>
    </div>
    <style type="text/css">
      html {
        height: 100%;
      }

      body {
        box-sizing: border-box;
        min-height: 100%;
        margin: 0;
        padding: 15px 30px;
        display: flex;
        flex-direction: column;
        color: white;
        font-family: "Segoe UI", "Helvetica Neue", "Helvetica", Arial, sans-serif;
        background-color: #2C2C32;
      }

      .message-container {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 30px;
      }

      .message {
        font-weight: 300;
        font-size: 1.4rem;
      }
    </style>
  </body>
  </html>`;
}

export async function cmdHdlLoadTreeView(context: ExtensionContext) {
  const treeViewProvider = CommandsTreeViewProvider.getInstance();
  const provider = window.registerTreeDataProvider("teamsfx", treeViewProvider);
  context.subscriptions.push(provider);

  // Register SignOut tree view command
  commands.registerCommand("teamsfx-extension.signOut", async (node: TreeViewCommand) => {
    switch (node.contextValue) {
      case "signedinM365": {
        const result = await AppStudioTokenInstance.signout();
        if (result) {
          await CommandsTreeViewProvider.getInstance().refresh([
            {
              commandId: "teamsfx-extension.signinM365",
              label: "Sign In M365...",
              contextValue: "signinM365"
            }
          ]);
        }
        break;
      }
      case "signedinAzure": {
        const result = await AzureAccountManager.signout();
        if (result) {
          await CommandsTreeViewProvider.getInstance().refresh([
            {
              commandId: "teamsfx-extension.signinAzure",
              label: "Sign In Azure...",
              contextValue: "signinAzure"
            }
          ]);
          await CommandsTreeViewProvider.getInstance().remove([
            {
              commandId: "teamsfx-extension.selectSubscription",
              label: "",
              parent: "teamsfx-extension.signinAzure"
            }
          ]);
        }
        break;
      }
    }
  });
}

export function cmdHdlDisposeTreeView() {
  CommandsTreeViewProvider.getInstance().dispose();
}

export async function showError(e: FxError) {
  VsCodeLogInstance.error(`code:${e.source}.${e.name}, message: ${e.message}, stack: ${e.stack}`);

  const errorCode = `${e.source}.${e.name}`;
  if (e instanceof UserError && e.helpLink && typeof e.helpLink != "undefined") {
    const help = {
      title: "Get Help",
      run: async (): Promise<void> => {
        commands.executeCommand("vscode.open", Uri.parse(`${e.helpLink}#${errorCode}`));
      }
    };

    const button = await window.showErrorMessage(`[${errorCode}]: ${e.message}`, help);
    if (button) await button.run();
  } else if (e instanceof SystemError && e.issueLink && typeof e.issueLink != "undefined") {
    const path = e.issueLink.replace(/\/$/, "") + "?";
    const param = `title=new+bug+report: ${errorCode}&body=${e.message}\n\n${e.stack}`;
    const issue = {
      title: "Report Issue",
      run: async (): Promise<void> => {
        commands.executeCommand("vscode.open", Uri.parse(`${path}${param}`));
      }
    };

    const button = await window.showErrorMessage(`[${errorCode}]: ${e.message}`, issue);
    if (button) await button.run();
  } else {
    await window.showErrorMessage(`[${errorCode}]: ${e.message}`);
  }
}