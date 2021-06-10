// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IConfig } from "../../commonUtils/interfaces/IConfig";
import { Utils } from "../utils/common";
import { Constants, Plugins } from "./constants";

export const provisionInputConfig: IConfig = new Map([
  [
    Plugins.AADPlugin.configKeys.permissionRequest,
    {
      plugin: Plugins.SolutionPlugin.id,
      key: Plugins.SolutionPlugin.configKeys.permissionRequest,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.objectId,
    {
      key: Plugins.AADPlugin.configKeys.objectId,
      required: false,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.clientSecret,
    {
      key: Plugins.AADPlugin.configKeys.clientSecret,
      required: false,
    }
  ],
]);

export const provisionOutputConfig: IConfig = new Map([
  [
    Plugins.AADPlugin.configKeys.clientId,
    {
      key: Plugins.AADPlugin.configKeys.clientId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.objectId,
    {
      key: Plugins.AADPlugin.configKeys.objectId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.clientSecret,
    {
      key: Plugins.AADPlugin.configKeys.clientSecret,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.oauth2PermissionScopeId,
    {
      key: Plugins.AADPlugin.configKeys.oauth2PermissionScopeId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.teamsMobileDesktopAppId,
    {
      value: Constants.teamsMobileDesktopAppId,
      key: Plugins.AADPlugin.configKeys.teamsMobileDesktopAppId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.teamsWebAppId,
    {
      value: Constants.teamsWebAppId,
      key: Plugins.AADPlugin.configKeys.teamsWebAppId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.oauthHost,
    {
      value: Constants.oauthAuthorityPrefix,
      key: Plugins.AADPlugin.configKeys.oauthHost,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.tenantId,
    {
      key: Plugins.AADPlugin.configKeys.tenantId,
    }
  ],
  [
    Plugins.AADPlugin.configKeys.oauthAuthority,
    {
      key: Plugins.AADPlugin.configKeys.oauthAuthority,
    }
  ],
]);