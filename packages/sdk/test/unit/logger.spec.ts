// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { assert, expect } from "chai";
import sinon from "sinon";
import {
  setLogger,
  internalLogger,
  setLogLevel,
  getLogLevel,
  LogLevel,
  Logger
} from "../../src/util/logger";

describe("Print function - node", () => {
  let errorStub: sinon.SinonStub<any[], void>;
  let warnStub: sinon.SinonStub<any[], void>;
  let infoStub: sinon.SinonStub<any[], void>;
  let verboseStub: sinon.SinonStub<any[], void>;
  let logger: Logger;

  beforeEach(() => {
    errorStub = sinon.stub();
    warnStub = sinon.stub();
    infoStub = sinon.stub();
    verboseStub = sinon.stub();
    logger = {
      error: errorStub,
      warn: warnStub,
      info: infoStub,
      verbose: verboseStub
    } as Logger;
    setLogger(logger);
  });

  afterEach(() => {
    errorStub.reset();
    warnStub.reset();
    infoStub.reset();
    verboseStub.reset();
    setLogger();
    setLogLevel(LogLevel.Info);
  });

  it("updates log level", () => {
    setLogLevel(LogLevel.Error);

    expect(getLogLevel()).to.equal(LogLevel.Error);
  });

  it("print all log when level is verbose", () => {
    setLogLevel(LogLevel.Verbose);

    internalLogger.error("test");
    assert.isTrue(errorStub.calledOnce);
    internalLogger.warn("test");
    assert.isTrue(warnStub.calledOnce);
    internalLogger.info("test");
    assert.isTrue(infoStub.calledOnce);
    internalLogger.verbose("test");
    assert.isTrue(verboseStub.calledOnce);
  });

  it("print error log only when level is error", () => {
    setLogLevel(LogLevel.Error);

    internalLogger.error("test");
    assert.isTrue(errorStub.called);
    internalLogger.warn("test");
    assert.isFalse(warnStub.called);
    internalLogger.info("test");
    assert.isFalse(infoStub.called);
    internalLogger.verbose("test");
    assert.isFalse(verboseStub.called);
  });
});