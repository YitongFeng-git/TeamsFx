// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as vscode from "vscode";
import { IExperimentationService, IExperimentationTelemetry, TargetPopulation, getExperimentationServiceAsync } from "vscode-tas-client";
import * as pkg from "./../../package.json";
import { ExtTelemetry } from "./../telemetry/extTelemetry"

class ExperimentationTelemetry implements IExperimentationTelemetry {
    private sharedProperties: {[key: string]: string};

    constructor() {
        this.sharedProperties = {};
    }

    public setSharedProperty(name: string, value: string): void {
        this.sharedProperties[name] = value;
    }

    public postEvent(eventName: string, props: Map<string, string>): void {
        let properties = { ...this.sharedProperties };
        props.forEach((value, key) => {
            properties[key] = value;
        });
        ExtTelemetry.sendTelemetryEvent(eventName, properties);
    }
}

let expService: IExperimentationService;

export function getExpService(): IExperimentationService {
    return expService;
}

export async function initialize(context: vscode.ExtensionContext) {
    expService = await getExperimentationServiceAsync(
        pkg.name,
        pkg.version,
        TargetPopulation.Public,
        new ExperimentationTelemetry(),
        context.globalState
    );
}