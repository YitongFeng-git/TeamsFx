// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import "mocha";
import * as chai from "chai";
import fs from "fs-extra";
import { AppStudioPlugin } from "./../../../../../src/plugins/resource/appstudio";

describe("validate manifest", () => {
    it("valid", async() => {
        const manifest = await fs.readJson("./../resources/valid.manifest.json");
        const manifestString = manifest.toString();

        const plugin = new AppStudioPlugin();
        const validationResult = await plugin.validateManifest(manifestString);
        chai.assert.isTrue(validationResult.isOk());
        if (validationResult.isOk()) {
            chai.assert.equal(validationResult.value, []);
        }
    });

    it("invalid", async() => {
        const manifest = await fs.readJson("./../resources/invalid.manifest.json");
        const manifestString = manifest.toString();

        const plugin = new AppStudioPlugin();
        const validationResult = await plugin.validateManifest(manifestString);
        chai.assert.isTrue(validationResult.isOk());
        if (validationResult.isOk()) {
            chai.assert(validationResult.value.length > 0);
        }
    });
});