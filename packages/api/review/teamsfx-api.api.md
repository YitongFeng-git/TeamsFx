## API Report File for "@microsoft/teamsfx-api"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Result } from 'neverthrow';
import { TokenCredential } from '@azure/core-http';
import { TokenCredentialsBase } from '@azure/ms-rest-nodeauth';

// @public @deprecated (undocumented)
export type Answer = string | undefined;

// @public
export interface AppStudioTokenProvider {
    getAccessToken(showDialog?: boolean): Promise<string | undefined>;
    getJsonObject(showDialog?: boolean): Promise<Record<string, unknown> | undefined>;
    removeStatusChangeMap(name: string): Promise<boolean>;
    setStatusChangeMap(name: string, statusChange: (status: string, token?: string, accountInfo?: Record<string, unknown>) => Promise<void>, immediateCall?: boolean): Promise<boolean>;
    signout(): Promise<boolean>;
}

// @public (undocumented)
export function assembleError(e: Error, source?: string): FxError;

// @public
export interface AzureAccountProvider {
    getAccountCredentialAsync(showDialog?: boolean, tenantId?: string): Promise<TokenCredentialsBase | undefined>;
    getIdentityCredentialAsync(showDialog?: boolean): Promise<TokenCredential | undefined>;
    getJsonObject(showDialog?: boolean): Promise<Record<string, unknown> | undefined>;
    listSubscriptions(): Promise<SubscriptionInfo[]>;
    removeStatusChangeMap(name: string): Promise<boolean>;
    setStatusChangeMap(name: string, statusChange: (status: string, token?: string, accountInfo?: Record<string, unknown>) => Promise<void>, immediateCall?: boolean): Promise<boolean>;
    setSubscription(subscriptionId: string): Promise<void>;
    signout(): Promise<boolean>;
}

// @public (undocumented)
export interface AzureSolutionSettings extends SolutionSettings {
    // (undocumented)
    activeResourcePlugins: string[];
    // (undocumented)
    azureResources: string[];
    // (undocumented)
    capabilities: string[];
    // (undocumented)
    hostType: string;
}

// @public
export interface BaseQuestion {
    default?: unknown;
    name: string;
    step?: number;
    title?: string;
    totalSteps?: number;
    value?: unknown;
}

// @public (undocumented)
export const CLIPlatforms: Platform[];

// @public
export enum Colors {
    BRIGHT_CYAN = 6,
    BRIGHT_GREEN = 3,
    BRIGHT_MAGENTA = 2,
    BRIGHT_RED = 5,
    BRIGHT_WHITE = 0,
    BRIGHT_YELLOW = 4,
    WHITE = 1
}

// @public (undocumented)
export const ConfigFolderName = "fx";

// @public (undocumented)
export class ConfigMap extends Map<string, ConfigValue> {
    constructor(entries?: readonly (readonly [string, ConfigValue])[] | null);
    // (undocumented)
    static fromJSON(obj?: Dict<unknown>): ConfigMap | undefined;
    // (undocumented)
    getBoolean(k: string, defaultValue?: boolean): boolean | undefined;
    // (undocumented)
    getBooleanArray(k: string, defaultValue?: boolean[]): boolean[] | undefined;
    // (undocumented)
    getNumber(k: string, defaultValue?: number): number | undefined;
    // (undocumented)
    getNumberArray(k: string, defaultValue?: number[]): number[] | undefined;
    // (undocumented)
    getOptionItem(k: string, defaultValue?: OptionItem): OptionItem | undefined;
    // (undocumented)
    getOptionItemArray(k: string, defaultValue?: OptionItem[]): OptionItem[] | undefined;
    // (undocumented)
    getString(k: string, defaultValue?: string): string | undefined;
    // (undocumented)
    getStringArray(k: string, defaultValue?: string[]): string[] | undefined;
    // (undocumented)
    toJSON(): Dict<unknown>;
}

// @public (undocumented)
export type ConfigValue = any;

// @public (undocumented)
export interface Context {
    // (undocumented)
    answers?: Inputs;
    // (undocumented)
    appStudioToken?: AppStudioTokenProvider;
    // (undocumented)
    azureAccountProvider?: AzureAccountProvider;
    // (undocumented)
    dialog?: Dialog;
    // (undocumented)
    graphTokenProvider?: GraphTokenProvider;
    // (undocumented)
    logProvider?: LogProvider;
    // (undocumented)
    projectSettings?: ProjectSettings;
    // (undocumented)
    root: string;
    // (undocumented)
    telemetryReporter?: TelemetryReporter;
    // (undocumented)
    treeProvider?: TreeProvider;
    // (undocumented)
    ui?: UserInteraction;
}

// @public (undocumented)
export interface Core {
    // (undocumented)
    buildArtifacts: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    createEnv: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    createProject: (systemInputs: Inputs) => Promise<Result<string, FxError>>;
    // (undocumented)
    deployArtifacts: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    executeUserTask: (func: Func, inputs: Inputs) => Promise<Result<unknown, FxError>>;
    getQuestions: (task: Stage, inputs: Inputs) => Promise<Result<QTreeNode | undefined, FxError>>;
    // (undocumented)
    getQuestionsForUserTask?: (router: FunctionRouter, inputs: Inputs) => Promise<Result<QTreeNode | undefined, FxError>>;
    // (undocumented)
    localDebug: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    provisionResources: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    publishApplication: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    removeEnv: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
    // (undocumented)
    switchEnv: (systemInputs: Inputs) => Promise<Result<Void, FxError>>;
}

// @public @deprecated (undocumented)
export interface Dialog {
    communicate: (msg: DialogMsg) => Promise<DialogMsg>;
    // Warning: (ae-forgotten-export) The symbol "IProgressHandler" needs to be exported by the entry point index.d.ts
    createProgressBar: (title: string, totalSteps: number) => IProgressHandler_2;
}

// @public @deprecated (undocumented)
export class DialogMsg {
    constructor(dialogType: DialogType, content: IMessage | IQuestion | IProgress | Answer);
    // (undocumented)
    content: IMessage | IQuestion | IProgress | Answer;
    // (undocumented)
    dialogType: DialogType;
    // (undocumented)
    getAnswer(): Answer | undefined;
}

// @public @deprecated (undocumented)
export enum DialogType {
    // (undocumented)
    Answer = "Answer",
    // (undocumented)
    Ask = "Ask",
    // (undocumented)
    Output = "Output",
    // (undocumented)
    Show = "Show",
    // (undocumented)
    ShowProgress = "ShowProgress"
}

// @public (undocumented)
export interface Dict<T> {
    // (undocumented)
    [key: string]: T | undefined;
}

// @public
export type DymanicOptions = LocalFunc<StaticOptions>;

// @public (undocumented)
export const DynamicPlatforms: Platform[];

// @public (undocumented)
export type EnvConfig = Dict<string>;

// @public
export interface EnvMeta {
    // (undocumented)
    local: boolean;
    // (undocumented)
    name: string;
    // (undocumented)
    sideloading: boolean;
}

// @public (undocumented)
export interface FolderQuestion extends UserInputQuestion {
    default?: string | LocalFunc<string | undefined>;
    // (undocumented)
    type: "folder";
    validation?: FuncValidation<string>;
    value?: string;
}

// @public (undocumented)
export interface Func extends FunctionRouter {
    // (undocumented)
    params?: unknown;
}

// @public
export interface FuncQuestion extends BaseQuestion {
    func: LocalFunc<any>;
    // (undocumented)
    type: "func";
}

// @public (undocumented)
export interface FunctionRouter {
    // (undocumented)
    method: string;
    // (undocumented)
    namespace: string;
}

// @public
export interface FuncValidation<T extends string | string[] | undefined> {
    validFunc: (input: T, previousInputs?: Inputs) => string | undefined | Promise<string | undefined>;
}

// @public (undocumented)
export interface FxError extends Error {
    innerError?: any;
    source: string;
    timestamp: Date;
}

// @public (undocumented)
export function getCallFuncValue(inputs: Inputs, raw?: unknown): Promise<unknown>;

// @public (undocumented)
export function getSingleOption(q: SingleSelectQuestion | MultiSelectQuestion, option?: StaticOptions): any;

// @public
export function getValidationFunction<T extends string | string[] | undefined>(validation: ValidationSchema, inputs: Inputs): (input: T) => string | undefined | Promise<string | undefined>;

// @public
export interface GraphTokenProvider {
    getAccessToken(showDialog?: boolean): Promise<string | undefined>;
    getJsonObject(showDialog?: boolean): Promise<Record<string, unknown> | undefined>;
    removeStatusChangeMap(name: string): Promise<boolean>;
    setStatusChangeMap(name: string, statusChange: (status: string, token?: string, accountInfo?: Record<string, unknown>) => Promise<void>, immediateCall?: boolean): Promise<boolean>;
    signout(): Promise<boolean>;
}

// @public
export interface Group {
    // (undocumented)
    name?: string;
    // (undocumented)
    type: "group";
}

// @public
export class GroupOfTasks<T> implements RunnableTask<Result<T, FxError>[]> {
    constructor(tasks: RunnableTask<T>[], config?: TaskGroupConfig);
    // (undocumented)
    cancel(): void;
    // (undocumented)
    config?: TaskGroupConfig;
    // (undocumented)
    current: number;
    // (undocumented)
    isCanceled: boolean;
    // (undocumented)
    message?: string;
    // (undocumented)
    name?: string;
    // (undocumented)
    run(...args: any): Promise<Result<Result<T, FxError>[], FxError>>;
    // (undocumented)
    tasks: RunnableTask<T>[];
    // (undocumented)
    readonly total: number;
}

// @public (undocumented)
export interface IActivityType {
    // (undocumented)
    description: string;
    // (undocumented)
    templateText: string;
    // (undocumented)
    type: string;
}

// @public (undocumented)
export interface IBot {
    botId: string;
    commandLists?: ICommandList[];
    isNotificationOnly?: boolean;
    needsChannelSelector?: boolean;
    scopes: ("team" | "personal" | "groupchat")[];
    supportsCalling?: boolean;
    supportsFiles?: boolean;
    supportsVideo?: boolean;
}

// @public (undocumented)
export interface ICommand {
    // (undocumented)
    description: string;
    // (undocumented)
    title: string;
}

// @public (undocumented)
export interface ICommandList {
    // (undocumented)
    commands: ICommand[];
    // (undocumented)
    scopes: ("team" | "personal" | "groupchat")[];
}

// @public (undocumented)
export interface IComposeExtension {
    botId: string;
    canUpdateConfiguration?: boolean;
    // (undocumented)
    commands: IMessagingExtensionCommand[];
    messageHandlers?: IComposeExtensionMessageHandler[];
    // (undocumented)
    objectId?: string;
}

// @public (undocumented)
export interface IComposeExtensionMessageHandler {
    type: "link";
    // (undocumented)
    value: {
        domains?: string[];
        [k: string]: unknown;
    };
}

// @public (undocumented)
export interface IConfigurableTab {
    canUpdateConfiguration?: boolean;
    configurationUrl: string;
    context?: ("channelTab" | "privateChatTab" | "meetingChatTab" | "meetingDetailsTab" | "meetingSidePanel" | "meetingStage")[];
    // (undocumented)
    objectId?: string;
    scopes: ("team" | "groupchat")[];
    sharePointPreviewImage?: string;
    supportedSharePointHosts?: ("sharePointFullPage" | "sharePointWebPart")[];
}

// @public (undocumented)
export interface IConnector {
    configurationUrl?: string;
    connectorId: string;
    scopes: "team"[];
}

// @public (undocumented)
export interface IDeveloper {
    mpnId?: string;
    name: string;
    privacyUrl: string;
    termsOfUseUrl: string;
    websiteUrl: string;
}

// @public (undocumented)
export interface IIcons {
    // (undocumented)
    color: string;
    // (undocumented)
    outline: string;
}

// @public (undocumented)
export interface ILocalizationInfo {
    // (undocumented)
    additionalLanguages?: {
        languageTag: string;
        file?: string;
    }[];
    defaultLanguageTag: string;
    // (undocumented)
    languages: any[];
}

// @public @deprecated (undocumented)
export interface IMessage {
    // (undocumented)
    description: string;
    // (undocumented)
    items?: string[];
    // (undocumented)
    level: MsgLevel;
    // (undocumented)
    modal?: boolean;
}

// @public (undocumented)
export interface IMessagingExtensionCommand {
    context?: ("compose" | "commandBox" | "message")[];
    description?: string;
    fetchTask?: boolean;
    id: string;
    initialRun?: boolean;
    // (undocumented)
    parameters?: IParameter[];
    // (undocumented)
    taskInfo?: ITaskInfo;
    title: string;
    type?: "query" | "action";
}

// @public (undocumented)
export interface IName {
    full?: string;
    // (undocumented)
    short: string;
}

// @public
export interface InputResult<T> {
    result?: T;
    type: "success" | "skip" | "back";
}

// @public (undocumented)
export interface Inputs extends Json {
    // (undocumented)
    correlationId?: string;
    // (undocumented)
    ignoreConfigPersist?: boolean;
    // (undocumented)
    ignoreLock?: boolean;
    // (undocumented)
    ignoreTypeCheck?: boolean;
    // (undocumented)
    platform: Platform;
    // (undocumented)
    projectPath?: string;
    // (undocumented)
    stage?: Stage;
    // (undocumented)
    vscodeEnv?: VsCodeEnv;
}

// @public
export interface InputTextConfig extends UIConfig<string> {
    password?: boolean;
}

// @public (undocumented)
export type InputTextResult = InputResult<string>;

// @public (undocumented)
export interface IParameter {
    choices?: {
        title: string;
        value: string;
    }[];
    description?: string;
    inputType?: "text" | "textarea" | "number" | "date" | "time" | "toggle" | "choiceset";
    name: string;
    title: string;
    value?: string;
}

// @public @deprecated
export interface IProgress {
    // (undocumented)
    cancellable?: boolean;
    // (undocumented)
    progressIter: AsyncGenerator<IProgressStatus, Result<null, FxError>>;
    // (undocumented)
    title?: string;
}

// @public (undocumented)
export interface IProgressHandler {
    end: () => Promise<void>;
    next: (detail?: string) => Promise<void>;
    start: (detail?: string) => Promise<void>;
}

// @public @deprecated (undocumented)
export interface IProgressStatus {
    // (undocumented)
    increment?: number;
    // (undocumented)
    message: string;
}

// @public @deprecated (undocumented)
export interface IQuestion {
    // (undocumented)
    defaultAnswer?: string;
    // (undocumented)
    description: string;
    // (undocumented)
    multiSelect?: boolean;
    // (undocumented)
    options?: string[];
    // (undocumented)
    password?: boolean;
    // (undocumented)
    prompt?: string;
    // (undocumented)
    terminalName?: string;
    // (undocumented)
    type: QuestionType;
    // (undocumented)
    validateInput?: (value: string) => string | undefined | null | Promise<string | undefined | null>;
}

// @public (undocumented)
export function isAutoSkipSelect(q: Question): boolean;

// @public (undocumented)
export interface IStaticTab {
    contentUrl?: string;
    context?: ("personalTab" | "channelTab")[];
    entityId: string;
    name?: string;
    // (undocumented)
    objectId?: string;
    scopes: ("team" | "personal")[];
    searchUrl?: string;
    websiteUrl?: string;
}

// @public (undocumented)
export interface ITaskInfo {
    height?: string;
    title?: string;
    url?: string;
    width?: string;
}

// @public (undocumented)
export interface IWebApplicationInfo {
    // (undocumented)
    applicationPermissions?: string[];
    id: string;
    resource?: string;
}

// @public (undocumented)
export type Json = Record<string, unknown>;

// @public (undocumented)
export function loadOptions(q: Question, inputs: Inputs): Promise<{
    autoSkip: boolean;
    options?: StaticOptions;
}>;

// @public
export type LocalFunc<T> = (inputs: Inputs) => T | Promise<T>;

// @public (undocumented)
export enum LogLevel {
    Debug = 1,
    Error = 4,
    Fatal = 5,
    Info = 2,
    Trace = 0,
    Warning = 3
}

// @public (undocumented)
export interface LogProvider {
    debug(message: string): Promise<boolean>;
    error(message: string): Promise<boolean>;
    fatal(message: string): Promise<boolean>;
    info(message: string): Promise<boolean>;
    info(message: Array<{
        content: string;
        color: Colors;
    }>): Promise<boolean>;
    log(logLevel: LogLevel, message: string): Promise<boolean>;
    trace(message: string): Promise<boolean>;
    warning(message: string): Promise<boolean>;
}

// @public @deprecated (undocumented)
export enum MsgLevel {
    // (undocumented)
    Error = "Error",
    // (undocumented)
    Info = "Info",
    // (undocumented)
    Warning = "Warning"
}

// @public (undocumented)
export interface MultiFileQuestion extends UserInputQuestion {
    default?: string | LocalFunc<string | undefined>;
    // (undocumented)
    type: "multiFile";
    validation?: FuncValidation<string[]>;
    value?: string[];
}

// @public
export interface MultiSelectConfig extends UIConfig<string[]> {
    onDidChangeSelection?: (currentSelectedIds: Set<string>, previousSelectedIds: Set<string>) => Promise<Set<string>>;
    options: StaticOptions;
    returnObject?: boolean;
}

// @public
export interface MultiSelectQuestion extends UserInputQuestion {
    default?: string[] | LocalFunc<string[] | undefined>;
    dynamicOptions?: DymanicOptions;
    onDidChangeSelection?: (currentSelectedIds: Set<string>, previousSelectedIds: Set<string>) => Promise<Set<string>>;
    returnObject?: boolean;
    skipSingleOption?: boolean;
    staticOptions: StaticOptions;
    // (undocumented)
    type: "multiSelect";
    validation?: StringArrayValidation | FuncValidation<string[]>;
    value?: string[] | OptionItem[];
}

// @public (undocumented)
export type MultiSelectResult = InputResult<StaticOptions>;

// @public
export interface OptionItem {
    cliName?: string;
    data?: unknown;
    description?: string;
    detail?: string;
    id: string;
    label: string;
}

// @public
export enum Platform {
    // (undocumented)
    CLI = "cli",
    // (undocumented)
    CLI_HELP = "cli_help",
    // (undocumented)
    VS = "vs",
    // (undocumented)
    VSCode = "vsc"
}

// @public
interface Plugin_2 {
    callFunc?: (func: Func, ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    deploy?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    executeUserTask?: (func: Func, ctx: PluginContext) => Promise<Result<any, FxError>>;
    getQuestions?: (stage: Stage, ctx: PluginContext) => Promise<Result<QTreeNode | undefined, FxError>>;
    getQuestionsForUserTask?: (func: Func, ctx: PluginContext) => Promise<Result<QTreeNode | undefined, FxError>>;
    localDebug?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    postDeploy?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    postLocalDebug?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    postProvision?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    postScaffold?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    preDeploy?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    preProvision?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    prerequisiteCheck?: (ctx: Readonly<Context>) => Promise<Result<{
        pass: true;
    } | {
        pass: false;
        msg: string;
    }, FxError>>;
    // (undocumented)
    preScaffold?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    provision?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    publish?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    scaffold?: (ctx: PluginContext) => Promise<Result<any, FxError>>;
}

export { Plugin_2 as Plugin }

// @public (undocumented)
export type PluginConfig = ConfigMap;

// @public (undocumented)
export interface PluginContext extends Context {
    // (undocumented)
    app: Readonly<TeamsAppManifest>;
    // (undocumented)
    config: PluginConfig;
    // (undocumented)
    configOfOtherPlugins: ReadonlySolutionConfig;
}

// @public (undocumented)
export type PluginIdentity = string;

// @public (undocumented)
export const ProductName = "teamsfx";

// @public (undocumented)
export interface ProjectConfig {
    // (undocumented)
    config?: SolutionConfig;
    // (undocumented)
    settings?: ProjectSettings;
}

// @public
export interface ProjectSettings {
    // (undocumented)
    appName: string;
    // (undocumented)
    currentEnv?: string;
    // (undocumented)
    projectId: string;
    // (undocumented)
    solutionSettings?: SolutionSettings;
}

// @public
export interface ProjectStates {
    // (undocumented)
    resources: {
        [k: string]: Dict<ConfigValue>;
    };
    // (undocumented)
    solution: Dict<ConfigValue>;
}

// @public
export class QTreeNode {
    constructor(data: Question | Group);
    // (undocumented)
    addChild(node: QTreeNode): QTreeNode;
    // (undocumented)
    children?: QTreeNode[];
    // (undocumented)
    condition?: ValidationSchema & {
        target?: string;
    };
    // (undocumented)
    data: Question | Group;
    trim(): QTreeNode | undefined;
    // (undocumented)
    validate(): boolean;
}

// @public (undocumented)
export type Question = SingleSelectQuestion | MultiSelectQuestion | TextInputQuestion | SingleFileQuestion | MultiFileQuestion | FolderQuestion | FuncQuestion | SingleFileQuestion;

// @public @deprecated (undocumented)
export enum QuestionType {
    // (undocumented)
    Confirm = "Confirm",
    // (undocumented)
    ExecuteCmd = "ExecuteCmd",
    // (undocumented)
    OpenExternal = "OpenExternal",
    // (undocumented)
    OpenFolder = "OpenFolder",
    // (undocumented)
    Radio = "radio",
    // (undocumented)
    SelectFolder = "SelectFolder",
    // (undocumented)
    Text = "Text",
    // (undocumented)
    UpdateGlobalState = "UpdateGlobalState"
}

// @public (undocumented)
export type ReadonlyPluginConfig = ReadonlyMap<string, ConfigValue>;

// @public (undocumented)
export type ReadonlyResourceConfig = Readonly<ResourceConfig>;

// @public (undocumented)
export type ReadonlyResourceConfigs = Readonly<{
    [k: string]: ReadonlyResourceConfig | undefined;
}>;

// @public (undocumented)
export type ReadonlySolutionConfig = ReadonlyMap<PluginIdentity, ReadonlyPluginConfig>;

// @public (undocumented)
export type ResourceConfig = ResourceTemplate;

// @public (undocumented)
export type ResourceConfigs = ResourceTemplates;

// @public (undocumented)
export type ResourceTemplate = Dict<ConfigValue>;

// @public (undocumented)
export type ResourceTemplates = {
    [k: string]: ResourceTemplate | undefined;
};

// @public (undocumented)
export function returnSystemError(e: Error, source: string, name: string, issueLink?: string, innerError?: any): SystemError;

// @public (undocumented)
export function returnUserError(e: Error, source: string, name: string, helpLink?: string, innerError?: any): UserError;

// @public
export interface RunnableTask<T> {
    cancel?(): void;
    current?: number;
    isCanceled?: boolean;
    message?: string;
    name?: string;
    run(...args: any): Promise<Result<T, FxError>>;
    readonly total?: number;
}

// @public
export interface SelectFileConfig extends UIConfig<string> {
}

// @public (undocumented)
export type SelectFileResult = InputResult<string>;

// @public
export interface SelectFilesConfig extends UIConfig<string[]> {
}

// @public (undocumented)
export type SelectFilesResult = InputResult<string[]>;

// @public
export interface SelectFolderConfig extends UIConfig<string> {
}

// @public (undocumented)
export type SelectFolderResult = InputResult<string>;

// @public
export interface SingleFileQuestion extends UserInputQuestion {
    default?: string | LocalFunc<string | undefined>;
    // (undocumented)
    type: "singleFile";
    validation?: FuncValidation<string>;
    value?: string;
}

// @public
export interface SingleSelectConfig extends UIConfig<string> {
    options: StaticOptions;
    returnObject?: boolean;
}

// @public
export interface SingleSelectQuestion extends UserInputQuestion {
    default?: string | LocalFunc<string | undefined>;
    dynamicOptions?: DymanicOptions;
    returnObject?: boolean;
    skipSingleOption?: boolean;
    staticOptions: StaticOptions;
    // (undocumented)
    type: "singleSelect";
    value?: string | OptionItem;
}

// @public (undocumented)
export type SingleSelectResult = InputResult<string | OptionItem>;

// @public (undocumented)
export interface Solution {
    // (undocumented)
    create: (ctx: SolutionContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    deploy: (ctx: SolutionContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    executeUserTask?: (func: Func, ctx: SolutionContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    getQuestions: (task: Stage, ctx: SolutionContext) => Promise<Result<QTreeNode | undefined, FxError>>;
    // (undocumented)
    getQuestionsForUserTask?: (func: Func, ctx: SolutionContext) => Promise<Result<QTreeNode | undefined, FxError>>;
    // (undocumented)
    localDebug: (ctx: SolutionContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    name: string;
    // (undocumented)
    provision: (ctx: SolutionContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    publish: (ctx: SolutionContext) => Promise<Result<any, FxError>>;
    // (undocumented)
    scaffold: (ctx: SolutionContext) => Promise<Result<any, FxError>>;
}

// @public (undocumented)
export type SolutionConfig = Map<PluginIdentity, PluginConfig>;

// @public (undocumented)
export interface SolutionContext extends Context {
    // (undocumented)
    config: SolutionConfig;
}

// @public
export interface SolutionSettings extends Dict<ConfigValue> {
    // (undocumented)
    name: string;
    // (undocumented)
    version: string;
}

// @public (undocumented)
export enum Stage {
    // (undocumented)
    build = "build",
    // (undocumented)
    create = "create",
    // (undocumented)
    createEnv = "createEnv",
    // (undocumented)
    debug = "debug",
    // (undocumented)
    deploy = "deploy",
    // (undocumented)
    provision = "provision",
    // (undocumented)
    publish = "publish",
    // (undocumented)
    removeEnv = "removeEnv",
    // (undocumented)
    switchEnv = "switchEnv",
    // (undocumented)
    update = "update",
    // (undocumented)
    userTask = "userTask"
}

// @public
export type StaticOptions = string[] | OptionItem[];

// @public (undocumented)
export const StaticPlatforms: Platform[];

// @public
export interface StaticValidation {
    equals?: unknown;
    required?: boolean;
}

// @public
export interface StringArrayValidation extends StaticValidation {
    contains?: string;
    containsAll?: string[];
    containsAny?: string[];
    enum?: string[];
    equals?: string[];
    maxItems?: number;
    minItems?: number;
    uniqueItems?: boolean;
}

// @public
export interface StringValidation extends StaticValidation {
    endsWith?: string;
    enum?: string[];
    equals?: string;
    includes?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    startsWith?: string;
}

// @public (undocumented)
export type SubscriptionInfo = {
    subscriptionName: string;
    subscriptionId: string;
    tenantId: string;
};

// @public
export class SystemError implements FxError {
    constructor(name: string, message: string, source: string, stack?: string, issueLink?: string, innerError?: any);
    innerError?: any;
    issueLink?: string;
    message: string;
    name: string;
    source: string;
    stack?: string;
    timestamp: Date;
}

// @public
export interface TaskConfig {
    cancellable?: boolean;
    showProgress?: boolean;
}

// @public
export interface TaskGroupConfig {
    fastFail?: boolean;
    sequential?: boolean;
}

// @public
export class TeamsAppManifest {
    // (undocumented)
    $schema?: string;
    accentColor: string;
    // (undocumented)
    activities?: {
        activityTypes?: IActivityType[];
    };
    bots?: IBot[];
    composeExtensions?: IComposeExtension[];
    configurableTabs?: IConfigurableTab[];
    connectors?: IConnector[];
    // (undocumented)
    description: IName;
    // (undocumented)
    developer: IDeveloper;
    devicePermissions?: ("geolocation" | "media" | "notifications" | "midi" | "openExternal")[];
    // (undocumented)
    icons: IIcons;
    id: string;
    isFullScreen?: boolean;
    // (undocumented)
    localizationInfo?: ILocalizationInfo;
    manifestVersion: string;
    // (undocumented)
    name: IName;
    packageName?: string;
    permissions?: ("identity" | "messageTeamMembers")[];
    showLoadingIndicator?: boolean;
    staticTabs?: IStaticTab[];
    validDomains?: string[];
    version: string;
    webApplicationInfo?: IWebApplicationInfo;
}

// @public
export interface TelemetryReporter {
    sendTelemetryErrorEvent(eventName: string, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }, errorProps?: string[]): void;
    sendTelemetryEvent(eventName: string, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }): void;
    sendTelemetryException(error: Error, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }): void;
}

// @public
export interface TextInputQuestion extends UserInputQuestion {
    default?: string | LocalFunc<string | undefined>;
    password?: boolean;
    // (undocumented)
    type: "text";
    validation?: StringValidation | FuncValidation<string>;
    value?: string;
}

// @public (undocumented)
export type TokenProvider = {
    azureAccountProvider: AzureAccountProvider;
    graphTokenProvider: GraphTokenProvider;
    appStudioToken: AppStudioTokenProvider;
};

// @public (undocumented)
export interface Tools {
    // (undocumented)
    dialog: Dialog;
    // (undocumented)
    logProvider: LogProvider;
    // (undocumented)
    telemetryReporter?: TelemetryReporter;
    // (undocumented)
    tokenProvider: TokenProvider;
    // (undocumented)
    treeProvider?: TreeProvider;
    // (undocumented)
    ui: UserInteraction;
}

// @public (undocumented)
export function traverse(root: QTreeNode, inputs: Inputs, ui: UserInteraction): Promise<Result<Void, FxError>>;

// @public (undocumented)
export enum TreeCategory {
    // (undocumented)
    Account = 1,
    // (undocumented)
    Feedback = 2,
    // (undocumented)
    GettingStarted = 0,
    // (undocumented)
    Project = 3,
    // (undocumented)
    Provison = 4
}

// @public (undocumented)
export interface TreeItem {
    // (undocumented)
    callback?: (args: any) => Promise<Result<null, FxError>>;
    // (undocumented)
    commandId: string;
    // (undocumented)
    contextValue?: string;
    // (undocumented)
    icon?: string;
    // (undocumented)
    label: string;
    // (undocumented)
    parent?: TreeCategory | string;
    // (undocumented)
    subTreeItems?: TreeItem[];
    // (undocumented)
    tooltip?: {
        value: string;
        isMarkdown: boolean;
    };
}

// @public (undocumented)
export interface TreeProvider {
    // (undocumented)
    add: (tree: TreeItem[]) => Promise<Result<null, FxError>>;
    // (undocumented)
    refresh: (tree: TreeItem[]) => Promise<Result<null, FxError>>;
    // (undocumented)
    remove: (tree: TreeItem[]) => Promise<Result<null, FxError>>;
}

// @public
export interface UIConfig<T> {
    default?: T;
    name: string;
    placeholder?: string;
    prompt?: string;
    step?: number;
    title: string;
    totalSteps?: number;
    validation?: (input: T) => string | undefined | Promise<string | undefined>;
}

// @public (undocumented)
export const UserCancelError: UserError;

// @public
export class UserError implements FxError {
    constructor(name: string, message: string, source: string, stack?: string, helpLink?: string, innerError?: any);
    helpLink?: string;
    innerError?: any;
    message: string;
    name: string;
    source: string;
    stack?: string;
    timestamp: Date;
}

// @public
export interface UserInputQuestion extends BaseQuestion {
    default?: string | string[] | LocalFunc<string | string[] | undefined>;
    placeholder?: string | LocalFunc<string | undefined>;
    prompt?: string | LocalFunc<string | undefined>;
    title: string;
    type: "singleSelect" | "multiSelect" | "singleFile" | "multiFile" | "folder" | "text";
    validation?: ValidationSchema;
    validationHelp?: string;
}

// @public
export interface UserInteraction {
    createProgressBar: (title: string, totalSteps: number) => IProgressHandler;
    inputText: (config: InputTextConfig) => Promise<Result<InputTextResult, FxError>>;
    openUrl(link: string): Promise<Result<boolean, FxError>>;
    runWithProgress<T>(task: RunnableTask<T>, config: TaskConfig, ...args: any): Promise<Result<T, FxError>>;
    selectFile: (config: SelectFileConfig) => Promise<Result<SelectFileResult, FxError>>;
    selectFiles: (config: SelectFilesConfig) => Promise<Result<SelectFilesResult, FxError>>;
    selectFolder: (config: SelectFolderConfig) => Promise<Result<SelectFolderResult, FxError>>;
    selectOption: (config: SingleSelectConfig) => Promise<Result<SingleSelectResult, FxError>>;
    selectOptions: (config: MultiSelectConfig) => Promise<Result<MultiSelectResult, FxError>>;
    showMessage(level: "info" | "warn" | "error", message: string, modal: boolean, ...items: string[]): Promise<Result<string | undefined, FxError>>;
    showMessage(level: "info" | "warn" | "error", message: Array<{
        content: string;
        color: Colors;
    }>, modal: boolean, ...items: string[]): Promise<Result<string | undefined, FxError>>;
}

// @public
export function validate<T extends string | string[] | undefined>(validSchema: ValidationSchema, value: T, inputs?: Inputs): Promise<string | undefined>;

// @public
export type ValidationSchema = StringValidation | StringArrayValidation | FuncValidation<any>;

// @public (undocumented)
export type Void = {};

// @public (undocumented)
export const Void: {};

// @public (undocumented)
export interface VsCode {
    addConfigurations: (configurations: any) => Promise<Result<null, FxError>>;
    // (undocumented)
    addInputs: (iputs: any) => Promise<Result<null, FxError>>;
    addRecommendations: (recommendations: any) => Promise<Result<null, FxError>>;
    addSettings: (settings: any) => Promise<Result<null, FxError>>;
    addTasks: (tasks: any) => Promise<Result<null, FxError>>;
}

// @public (undocumented)
export enum VsCodeEnv {
    // (undocumented)
    codespaceBrowser = "codespaceBrowser",
    // (undocumented)
    codespaceVsCode = "codespaceVsCode",
    // (undocumented)
    local = "local",
    // (undocumented)
    remote = "remote"
}


export * from "neverthrow";

// (No @packageDocumentation comment for this package)

```
