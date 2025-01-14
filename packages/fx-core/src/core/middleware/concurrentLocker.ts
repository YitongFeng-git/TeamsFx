// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
"use strict";

import { HookContext, NextFunction, Middleware } from "@feathersjs/hooks"; 
import { ConfigFolderName, err, Inputs,  ok,  StaticPlatforms, Void } from "@microsoft/teamsfx-api";
import * as path from "path";
import * as fs from "fs-extra";
import { FxCore } from "..";
import { ConcurrentError, InvalidProjectError, NoProjectOpenedError, PathNotExistError } from "../error";
import { lock, unlock } from "proper-lockfile";

export const ConcurrentLockerMW: Middleware = async (
  ctx: HookContext,
  next: NextFunction
) => {
  const core = ctx.self as FxCore;
  const inputs = ctx.arguments[ctx.arguments.length - 1] as Inputs;
  const logger = (core !== undefined && core.tools!== undefined && core.tools.logProvider!== undefined) ? core.tools.logProvider:undefined;
  const ignoreLock = inputs.ignoreLock === true || StaticPlatforms.includes(inputs.platform); 
  if(ignoreLock === false){
    if(!inputs.projectPath){
      ctx.result = err(NoProjectOpenedError());
      return ;
    }
    if(!await fs.pathExists(inputs.projectPath)) {
      ctx.result = err(PathNotExistError(inputs.projectPath));
      return ;
    }
    const lf = path.join(inputs.projectPath!,`.${ConfigFolderName}`);
    if(!await fs.pathExists(lf)) {
      ctx.result = err(InvalidProjectError());
      return ;
    }
    await lock(lf)
      .then(async () => {
        if(logger)
          logger.debug(`[core] success to aquire lock on: ${lf}`);
        try{
          await next();
        }
        finally{
          await unlock(lf);
          if(logger)
            logger.debug(`[core] lock released on ${lf}`);
        }
      })
      .catch((e:any) => {
        if(e["code"] === "ELOCKED"){
          if(logger)
            logger.warning(`[core] failed to aquire lock on: ${lf}`);
          ctx.result = err(ConcurrentError());
          return;
        }
        throw e;
      });
  }
  else {
    await next();
  }
};
