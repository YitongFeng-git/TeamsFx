// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { assert, use as chaiUse, expect } from "chai";
import chaiPromises from "chai-as-promised";
import {
  loadConfiguration,
  ErrorWithCode,
  ErrorCode,
  getAuthenticationConfiguration
} from "../../../src";

chaiUse(chaiPromises);

describe("ConfigurationProvider Tests - Browser", () => {
  const clientId = "fake_client_id";
  const loginUrl = "fake_login_url";
  const authEndpoint = "fake_auth_endpoint";

  it("ConfigurationProvider: Get authentication configuration from local object", () => {
    loadConfiguration({
      authentication: {
        initiateLoginEndpoint: loginUrl,
        simpleAuthEndpoint: authEndpoint,
        clientId: clientId
      }
    });

    const authConfig = getAuthenticationConfiguration();

    assert.isNotNull(authConfig);
    if (authConfig) {
      assert.strictEqual(authConfig.initiateLoginEndpoint, loginUrl);
      assert.strictEqual(authConfig.clientId, clientId);
      assert.strictEqual(authConfig.simpleAuthEndpoint, authEndpoint);
    }
  });

  it("ConfigurationProvider: Load configuration should throw exception if no config passed in browser environment", () => {
    expect(() => {
      loadConfiguration();
    })
      .throw(ErrorWithCode)
      .that.has.property("code")
      .equal(ErrorCode.InvalidParameter);
  });

  it("ConfigurationProvider: Get authentication configuration should get undefined result if loadConfiguration without parameter", () => {
    loadConfiguration({});
    const authConfig = getAuthenticationConfiguration();
    assert.isUndefined(authConfig);
  });
});
