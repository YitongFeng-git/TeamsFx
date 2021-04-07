/* eslint-disable @typescript-eslint/no-empty-function */
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

import { TokenCredential } from "@azure/core-auth";
import { TokenCredentialsBase } from "@azure/ms-rest-nodeauth";
import { AzureAccountProvider, UserError } from "teamsfx-api";
import { ExtensionErrors } from "../error";
import { AzureAccount } from "./azure-account.api";
import { LoginFailureError } from "./codeFlowLogin";
import * as vscode from "vscode";
import * as identity from "@azure/identity";

export class AzureAccountManager implements AzureAccountProvider {
  private static instance: AzureAccountManager;

  private static statusChange?: (
    status: string,
    token?: string,
    accountInfo?: Record<string, unknown>
  ) => Promise<void>;

  private constructor() {}

  /**
   * Gets instance
   * @returns instance
   */
  public static getInstance(): AzureAccountManager {
    if (!AzureAccountManager.instance) {
      AzureAccountManager.instance = new AzureAccountManager();
    }

    return AzureAccountManager.instance;
  }

  /**
   * Get AccountCredential
   *  - Use scenario : https://docs.microsoft.com/en-us/azure/developer/javascript/core/node-sdk-azure-authenticate
   *  - NPM guideline : https://docs.microsoft.com/en-us/azure/developer/javascript/core/node-sdk-azure-authenticate
   * @returns the instance of TokenCredentialsBase
   */
  getAccountCredential(showDialog = true): TokenCredentialsBase | undefined {
    const azureAccount: AzureAccount = vscode.extensions.getExtension<AzureAccount>(
      "ms-vscode.azure-account"
    )!.exports;
    if (azureAccount.status === "LoggedIn") {
      if (azureAccount.subscriptions.length > 0) {
        return azureAccount.subscriptions[0].session.credentials2;
      } else if (azureAccount.sessions.length > 0) {
        return azureAccount.sessions[0].credentials2;
      } else {
        return undefined;
      }
    }
    return undefined;
  }

  /**
   * Get IdentityCredential
   *  - Use scenario : https://docs.microsoft.com/en-us/azure/developer/javascript/core/node-sdk-azure-authenticate
   *  - NPM guideline : https://www.npmjs.com/package/@azure/ms-rest-nodeauth
   * @returns the instance of TokenCredential
   */
  getIdentityCredential(showDialog = true): TokenCredential | undefined {
    const vsCredential = new identity.VisualStudioCodeCredential();
    return vsCredential;
  }

  /**
   * Async get ms-rest-* [credential](https://github.com/Azure/ms-rest-nodeauth/blob/master/lib/credentials/tokenCredentialsBase.ts)
   */
  async getAccountCredentialAsync(showDialog = true): Promise<TokenCredentialsBase | undefined> {
    if (this.isUserLogin()) {
      return this.doGetAccountCredentialAsync();
    }
    await this.login(showDialog);
    await this.updateLoginStatus();
    return this.doGetAccountCredentialAsync();
  }

  /**
   * Async get identity [crendential](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/core/core-auth/src/tokenCredential.ts)
   */
  async getIdentityCredentialAsync(showDialog = true): Promise<TokenCredential | undefined> {
    if (this.isUserLogin()) {
      return this.doGetIdentityCredentialAsync();
    }
    await this.login(showDialog);
    return this.doGetIdentityCredentialAsync();
  }

  private async updateLoginStatus(): Promise<void> {
    if (this.isUserLogin() && AzureAccountManager.statusChange !== undefined) {
      const credential = await this.doGetAccountCredentialAsync();
      const accessToken = await credential?.getToken();
      const accountJson = await this.getJsonObject();
      await AzureAccountManager.statusChange("SignedIn", accessToken?.accessToken, accountJson);
    }
  }

  private isUserLogin(): boolean {
    const azureAccount: AzureAccount = vscode.extensions.getExtension<AzureAccount>(
      "ms-vscode.azure-account"
    )!.exports;
    return azureAccount.status === "LoggedIn";
  }

  private async login(showDialog: boolean): Promise<void> {
    if (showDialog) {
      const userConfirmation: boolean = await this.doesUserConfirmLogin();
      if (!userConfirmation) {
        // throw user cancel error
        throw new UserError(ExtensionErrors.UserCancel, "User Cancel", "Login");
      }
    }
    await vscode.commands.executeCommand("azure-account.login");
  }

  private doGetAccountCredentialAsync(): Promise<TokenCredentialsBase | undefined> {
    if (this.isUserLogin()) {
      const azureAccount: AzureAccount = vscode.extensions.getExtension<AzureAccount>(
        "ms-vscode.azure-account"
      )!.exports;
      // Choose one tenant credential when users have multi tenants. (TODO, need to optize after UX design)
      // 1. When azure-account-extension has at least one subscription, return the first one credential.
      // 2. When azure-account-extension has no subscription and has at at least one session, return the first session credential.
      // 3. When azure-account-extension has no subscription and no session, return undefined.
      return new Promise(async (resolve, reject) => {
        await azureAccount.waitForSubscriptions();
        if (azureAccount.subscriptions.length > 0) {
          resolve(azureAccount.subscriptions[0].session.credentials2);
        } else if (azureAccount.sessions.length > 0) {
          resolve(azureAccount.sessions[0].credentials2);
        } else {
          reject(LoginFailureError());
        }
      });
    }
    return Promise.reject(LoginFailureError());
  }

  private doGetIdentityCredentialAsync(): Promise<TokenCredential | undefined> {
    if (this.isUserLogin()) {
      return new Promise((resolve) => {
        const vsCredential = new identity.VisualStudioCodeCredential();
        resolve(vsCredential);
      });
    }
    return Promise.reject(LoginFailureError());
  }

  private async doesUserConfirmLogin(): Promise<boolean> {
    const warningMsg = "Please sign into your Azure account";
    const confirm = "Confirm";
    const userSelected: string | undefined = await vscode.window.showWarningMessage(
      warningMsg,
      { modal: true },
      confirm
    );
    return Promise.resolve(userSelected === confirm);
  }

  async getJsonObject(showDialog = true): Promise<Record<string, unknown> | undefined> {
    const credential = await this.getAccountCredentialAsync(showDialog);
    const token = await credential?.getToken();
    if (token) {
      const array = token.accessToken.split(".");
      const buff = Buffer.from(array[1], "base64");
      return new Promise((resolve) => {
        resolve(JSON.parse(buff.toString("utf-8")));
      });
    } else {
      return new Promise((resolve) => {
        resolve(undefined);
      });
    }
  }

  /**
   * singnout from Azure
   */
  async signout(): Promise<boolean> {
    await vscode.commands.executeCommand("azure-account.logout");
    if (AzureAccountManager.statusChange !== undefined) {
      await AzureAccountManager.statusChange("SignedOut", undefined, undefined);
    }
    return new Promise((resolve) => {
      resolve(true);
    });
  }

  /**
   * Add update account info callback
   */
  async setStatusChangeCallback(
    statusChange: (status: string, token?: string, accountInfo?: Record<string, unknown>) => Promise<void>
  ): Promise<boolean> {
    AzureAccountManager.statusChange = statusChange;
    return new Promise((resolve) => {
      resolve(true);
    });
  }
}

export default AzureAccountManager.getInstance();