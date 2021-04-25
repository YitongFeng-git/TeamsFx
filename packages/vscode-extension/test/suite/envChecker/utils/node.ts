// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { cpUtils } from "../../../../src/debug/depsChecker/cpUtils";

export async function getNodeVersion(): Promise<string | null> {
    try {
        const output = await cpUtils.executeCommand(undefined, undefined, undefined, "node", "--version");
        // "node --version" outputs "v14.2.3"
        // remove leading "v"
        return output.trim().slice(1);
    } catch (error) {
        console.debug(`Failed to run 'node --version', error = '${error}'`);
        return null;
    }
}