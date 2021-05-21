// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { ConfigMap, PluginConfig, ProjectSettings, ReadonlySolutionConfig, SolutionConfig } from "./config";
 
import { VsCode } from "./vscode";
import { TeamsAppManifest } from "./manifest";
import {
    GraphTokenProvider,
    LogProvider,
    TelemetryReporter,
    AzureAccountProvider,
    AppStudioTokenProvider,
    Dialog,
    TreeProvider
} from "./utils"; 
import { Platform } from "./constants";
import { UserInterface } from "./qm";

/*
 * Context will be generated by Core and carry necessary information to
 * develop a Teams APP.
 */
export interface Context {
    
    root: string;

    dialog?: Dialog;

    logProvider?: LogProvider;

    telemetryReporter?: TelemetryReporter;

    azureAccountProvider?: AzureAccountProvider;

    graphTokenProvider?: GraphTokenProvider;

    appStudioToken?: AppStudioTokenProvider;

    treeProvider?: TreeProvider;

    platform? : Platform;

    answers?: ConfigMap; // for question model

    projectSettings?:ProjectSettings;
    
    ui?: UserInterface;
}

export interface SolutionContext extends Context {
    dotVsCode?: VsCode;

    app: TeamsAppManifest;

    config: SolutionConfig;
}

export interface PluginContext extends Context {
    // A readonly view of other plugins' config
    // FolderProvider: FolderProvider;

    // A readonly view of other plugins' config
    configOfOtherPlugins: ReadonlySolutionConfig;

    // A mutable config for current plugin
    config: PluginConfig;

    // A readonly of view of teams manifest. Useful for bot plugin.
    app: Readonly<TeamsAppManifest>;
}
