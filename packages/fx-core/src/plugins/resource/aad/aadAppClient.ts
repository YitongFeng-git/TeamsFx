// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PluginContext } from "@microsoft/teamsfx-api";
import { AppStudio } from "./appStudio";
import { ConfigKeys, Constants, Telemetry } from "./constants";
import {
  AppStudioErrorMessage,
  CreateSecretError,
  CreateAppError,
  UpdateAppIdUriError,
  UpdatePermissionError,
  UpdateRedirectUriError,
  GetAppError,
  GetAppConfigError,
} from "./errors";
import { GraphClient } from "./graph";
import { IAADPassword } from "./interfaces/IAADApplication";
import { IAADDefinition, RequiredResourceAccess } from "./interfaces/IAADDefinition";
import { ResultFactory } from "./results";
import { ProvisionConfig } from "./utils/configs";
import { TelemetryUtils } from "./utils/telemetry";
import { TokenAudience, TokenProvider } from "./utils/tokenProvider";

function delay(ms: number) {
  // tslint:disable-next-line no-string-based-set-timeout
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class AadAppClient {
  public static async createAadApp(
    ctx: PluginContext,
    stage: string,
    config: ProvisionConfig
  ): Promise<void> {
    try {
      const provisionObject = AadAppClient.getAadAppProvisionObject(
        config.displayName as string,
        config.oauth2PermissionScopeId as string
      );
      let provisionAadResponse: IAADDefinition;
      if (TokenProvider.audience === TokenAudience.AppStudio) {
        provisionAadResponse = (await this.retryHanlder(ctx, stage, () =>
          AppStudio.createAADAppV2(TokenProvider.token as string, provisionObject)
        )) as IAADDefinition;
      } else {
        provisionAadResponse = (await this.retryHanlder(ctx, stage, () =>
          GraphClient.createAADApp(TokenProvider.token as string, provisionObject)
        )) as IAADDefinition;
      }

      config.clientId = provisionAadResponse.appId;
      config.objectId = provisionAadResponse.id;
    } catch (error) {
      if (
        error?.response?.status >= Constants.statusCodeUserError &&
        error?.response?.status < Constants.statusCodeServerError
      ) {
        throw ResultFactory.UserError(CreateAppError.name, CreateAppError.message(), error);
      }
      throw ResultFactory.SystemError(CreateAppError.name, CreateAppError.message(), error);
    }
  }

  public static async createAadAppSecret(
    ctx: PluginContext,
    stage: string,
    config: ProvisionConfig
  ): Promise<void> {
    try {
      let createSecretObject: IAADPassword;
      if (TokenProvider.audience === TokenAudience.AppStudio) {
        createSecretObject = (await AadAppClient.retryHanlder(ctx, stage, () =>
          AppStudio.createAADAppPassword(TokenProvider.token as string, config.objectId as string)
        )) as IAADPassword;
      } else {
        createSecretObject = (await AadAppClient.retryHanlder(ctx, stage, () =>
          GraphClient.createAadAppSecret(TokenProvider.token as string, config.objectId as string)
        )) as IAADPassword;
      }
      config.password = createSecretObject.value;
    } catch (error) {
      if (
        error?.response?.status >= Constants.statusCodeUserError &&
        error?.response?.status < Constants.statusCodeServerError
      ) {
        throw ResultFactory.UserError(CreateSecretError.name, CreateSecretError.message(), error);
      }
      throw ResultFactory.SystemError(CreateSecretError.name, CreateSecretError.message(), error);
    }
  }

  public static async updateAadAppRedirectUri(
    ctx: PluginContext,
    stage: string,
    objectId: string,
    redirectUris: string[]
  ): Promise<void> {
    try {
      const updateRedirectUriObject = AadAppClient.getAadUrlObject(redirectUris);
      if (TokenProvider.audience === TokenAudience.AppStudio) {
        await AadAppClient.retryHanlder(ctx, stage, () =>
          AppStudio.updateAADApp(
            TokenProvider.token as string,
            objectId as string,
            updateRedirectUriObject
          )
        );
      } else {
        await AadAppClient.retryHanlder(ctx, stage, () =>
          GraphClient.updateAADApp(
            TokenProvider.token as string,
            objectId as string,
            updateRedirectUriObject
          )
        );
      }
    } catch (error) {
      if (
        error?.response?.status >= Constants.statusCodeUserError &&
        error?.response?.status < Constants.statusCodeServerError
      ) {
        throw ResultFactory.UserError(
          UpdateRedirectUriError.name,
          UpdateRedirectUriError.message(),
          error
        );
      }
      throw ResultFactory.SystemError(
        UpdateRedirectUriError.name,
        UpdateRedirectUriError.message(),
        error
      );
    }
  }

  public static async updateAadAppIdUri(
    ctx: PluginContext,
    stage: string,
    objectId: string,
    applicationIdUri: string
  ): Promise<void> {
    try {
      const updateAppIdObject = AadAppClient.getAadApplicationIdObject(applicationIdUri);
      if (TokenProvider.audience === TokenAudience.AppStudio) {
        await AadAppClient.retryHanlder(ctx, stage, () =>
          AppStudio.updateAADApp(
            TokenProvider.token as string,
            objectId as string,
            updateAppIdObject
          )
        );
      } else {
        await AadAppClient.retryHanlder(ctx, stage, () =>
          GraphClient.updateAADApp(
            TokenProvider.token as string,
            objectId as string,
            updateAppIdObject
          )
        );
      }
    } catch (error) {
      if (
        error?.response?.status >= Constants.statusCodeUserError &&
        error?.response?.status < Constants.statusCodeServerError
      ) {
        throw ResultFactory.UserError(
          UpdateAppIdUriError.name,
          UpdateAppIdUriError.message(),
          error,
          undefined,
          UpdateAppIdUriError.helpLink
        );
      }
      throw ResultFactory.SystemError(
        UpdateAppIdUriError.name,
        UpdateAppIdUriError.message(),
        error
      );
    }
  }

  public static async updateAadAppPermission(
    ctx: PluginContext,
    stage: string,
    objectId: string,
    permissions: RequiredResourceAccess[]
  ): Promise<void> {
    try {
      const updatePermissionObject = AadAppClient.getAadPermissionObject(permissions);
      if (TokenProvider.audience === TokenAudience.AppStudio) {
        await AadAppClient.retryHanlder(ctx, stage, () =>
          AppStudio.updateAADApp(
            TokenProvider.token as string,
            objectId as string,
            updatePermissionObject
          )
        );
      } else {
        await AadAppClient.retryHanlder(ctx, stage, () =>
          GraphClient.updateAADApp(
            TokenProvider.token as string,
            objectId as string,
            updatePermissionObject
          )
        );
      }
    } catch (error) {
      if (
        error?.response?.status >= Constants.statusCodeUserError &&
        error?.response?.status < Constants.statusCodeServerError
      ) {
        throw ResultFactory.UserError(
          UpdatePermissionError.name,
          UpdatePermissionError.message(),
          error
        );
      }
      throw ResultFactory.SystemError(
        UpdatePermissionError.name,
        UpdatePermissionError.message(),
        error
      );
    }
  }

  public static async getAadApp(
    ctx: PluginContext,
    stage: string,
    objectId: string,
    islocalDebug: boolean,
    clientSecret: string | undefined
  ): Promise<ProvisionConfig> {
    let getAppObject: IAADDefinition;
    try {
      if (TokenProvider.audience === TokenAudience.AppStudio) {
        getAppObject = (await this.retryHanlder(ctx, stage, () =>
          AppStudio.getAadApp(TokenProvider.token as string, objectId)
        )) as IAADDefinition;
      } else {
        getAppObject = (await this.retryHanlder(ctx, stage, () =>
          GraphClient.getAadApp(TokenProvider.token as string, objectId)
        )) as IAADDefinition;
      }
    } catch (error) {
      if (
        error?.response?.status >= Constants.statusCodeUserError &&
        error?.response?.status < Constants.statusCodeServerError
      ) {
        throw ResultFactory.UserError(GetAppError.name, GetAppError.message(), error);
      }
      throw ResultFactory.SystemError(GetAppError.name, GetAppError.message(), error);
    }

    const config = new ProvisionConfig(islocalDebug);
    if (
      getAppObject.api?.oauth2PermissionScopes &&
      getAppObject.api?.oauth2PermissionScopes[0].id
    ) {
      config.oauth2PermissionScopeId = getAppObject.api?.oauth2PermissionScopes[0].id;
    } else {
      throw ResultFactory.UserError(
        GetAppConfigError.name,
        GetAppConfigError.message(ConfigKeys.oauth2PermissionScopeId)
      );
    }
    config.objectId = objectId;
    config.clientId = getAppObject.appId;
    config.password = clientSecret;
    return config;
  }

  private static async retryHanlder(
    ctx: PluginContext,
    stage: string,
    fn: () => Promise<IAADDefinition | IAADPassword | void>
  ): Promise<IAADDefinition | IAADPassword | undefined | void> {
    let retries = Constants.maxRetryTimes;
    let response;
    TelemetryUtils.init(ctx);
    while (retries > 0) {
      retries = retries - 1;

      try {
        response = await fn();
        TelemetryUtils.sendEvent(stage, {
          [Telemetry.methodName]: fn.toString(),
          [Telemetry.retryTimes]: (Constants.maxRetryTimes - retries - 1).toString(),
        });
        return response;
      } catch (error) {
        if (retries === 0) {
          throw error;
        } else {
          await delay(5000);
        }
      }
    }

    throw new Error(AppStudioErrorMessage.ReachRetryLimit);
  }

  private static getAadAppProvisionObject(
    displayName: string,
    oauth2PermissionScopeId: string
  ): IAADDefinition {
    return {
      displayName: displayName,
      signInAudience: "AzureADMyOrg",
      api: {
        requestedAccessTokenVersion: 2,
        oauth2PermissionScopes: [
          {
            adminConsentDescription: "Allows Teams to call the app’s web APIs as the current user.",
            adminConsentDisplayName: "Teams can access app’s web APIs",
            id: oauth2PermissionScopeId,
            isEnabled: true,
            type: "User",
            userConsentDescription:
              "Enable Teams to call this app’s web APIs with the same rights that you have",
            userConsentDisplayName:
              "Teams can access app’s web APIs and make requests on your behalf",
            value: "access_as_user",
          },
        ],
        preAuthorizedApplications: [
          {
            appId: Constants.teamsWebAppId,
            delegatedPermissionIds: [oauth2PermissionScopeId],
          },
          {
            appId: Constants.teamsMobileDesktopAppId,
            delegatedPermissionIds: [oauth2PermissionScopeId],
          },
        ],
      },
      optionalClaims: {
        accessToken: [
          {
            name: "idtyp",
            essential: false,
            additionalProperties: [],
          },
        ],
      },
    };
  }

  private static getAadUrlObject(redirectUris: string[]): IAADDefinition {
    return {
      web: {
        redirectUris: redirectUris,
      },
    };
  }

  private static getAadApplicationIdObject(applicationIdUri: string): IAADDefinition {
    return {
      identifierUris: [applicationIdUri],
    };
  }

  private static getAadPermissionObject(permissions: RequiredResourceAccess[]): IAADDefinition {
    return {
      requiredResourceAccess: permissions,
    };
  }
}
