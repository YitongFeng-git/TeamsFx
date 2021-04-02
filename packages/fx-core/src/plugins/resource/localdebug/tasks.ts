// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { ProductName } from "teamsfx-api";

export function generateTasks(includeFrontend: boolean, includeBackend: boolean, includeBot: boolean): Record<string, unknown>[] {
    /**
     * Referenced by launch.json
     *   - Pre Debug Check
     *   - Start Frontend
     *   - Stop All Services
     *
     * Referenced inside tasks.json
     *   - prepare dev env
     *   - prepare local environment
     *   - frontend npm install
     *   - backend npm install
     *   - backend extensions install
     */
     const tasks: Record<string, unknown>[] = [
        {
            label: "Stop All Services",
            type: "shell",
            command: "echo ${input:terminate}",
        },
        {
            label: "Pre Debug Check",
            dependsOn: [
                "dependency check",
                "prepare dev env",
            ],
            dependsOrder: "sequence",
        },
        {
            label: "dependency check",
            type: "shell",
            command: "echo ${command:vscode-teamsfx.validate-dependencies}",
        },
    ];

    // Tab only
    if (includeFrontend && !includeBot) {
        tasks.push(
            {
                label: "Start Frontend",
                dependsOn: [`${ProductName}: frontend start`, `${ProductName}: auth start`],
                dependsOrder: "parallel",
            },
            {
                label: "prepare dev env",
                dependsOn: includeBackend
                    ? ["prepare local environment", "backend npm install", "frontend npm install"]
                    : ["prepare local environment", "frontend npm install"],
                dependsOrder: "parallel",
            },
            {
                label: "prepare local environment",
                type: "shell",
                command: "echo ${command:vscode-teamsfx.pre-debug-check}",
            },
            {
                label: "frontend npm install",
                type: "shell",
                command: "npm install",
                options: {
                    cwd: "${workspaceFolder}/tabs",
                },
            },
        );
        if (includeBackend) {
            tasks.push(
                {
                    label: "backend npm install",
                    type: "shell",
                    command: "npm install",
                    options: {
                        cwd: "${workspaceFolder}/api",
                    },
                    presentation: {
                        reveal: "silent",
                    },
                    dependsOn: "backend extensions install",
                },
                {
                    label: "backend extensions install",
                    type: "shell",
                    command: "echo ${command:vscode-teamsfx.backend-extensions-install}",
                },
            );
        }
    }

    // Bot only
    if (!includeFrontend && includeBot) {
        tasks.push(
            {
                label: "prepare dev env",
                dependsOn: ["start ngrok", "prepare local environment"],
                dependsOrder: "sequence",
            },
            {
                label: "start ngrok",
                type: ProductName,
                command: "ngrok start",
                isBackground: true,
                presentation: {
                    panel: "new",
                },
                dependsOn: ["bot npm install"],
            },
            {
                label: "bot npm install",
                type: "shell",
                command: "npm install",
                options: {
                    cwd: "${workspaceFolder}/bot",
                },
            },
            {
                label: "prepare local environment",
                type: "shell",
                command: "echo ${command:vscode-teamsfx.pre-debug-check}",
            },
        );
    }

    // Tab and bot
    if (includeFrontend && includeBot) {
        // TODO
    }

    return tasks;
}

export function generateInputs(): Record<string, unknown>[] {
    // call terminate with terminateAll args in input to not require user to select which task(s) to terminate
    return [
        {
            id: "terminate",
            type: "command",
            command: "workbench.action.tasks.terminate",
            args: "terminateAll",
        },
    ];
}

export function generateSpfxTasks(): Record<string, unknown>[] {
    return [
        {
            label: "npm install",
            type: "shell",
            command: "npm install",
            options: {
                cwd: "${workspaceFolder}/SPFx",
            },
        },
        {
            label: "gulp serve",
            type: "process",
            command: "node",
            args: ["${workspaceFolder}/SPFx/node_modules/gulp/bin/gulp.js", "serve", "--nobrowser"],
            problemMatcher: [
                {
                    pattern: [
                        {
                            regexp: ".",
                            file: 1,
                            location: 2,
                            message: 3,
                        },
                    ],
                    background: {
                        activeOnStart: true,
                        beginsPattern: "^.*Staring gulp.*",
                        endsPattern: "^.*Finished subtask \"reload\".*",
                    },
                },
            ],
            isBackground: true,
            options: {
                cwd: "${workspaceFolder}/SPFx",
            },
            dependsOn: "npm install",
        },
        {
            label: "Terminate All Tasks",
            command: "echo ${input:terminate}",
            type: "shell",
            problemMatcher: [],
        },
    ];
}