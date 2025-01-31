// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
 
import { HookContext, NextFunction } from "@feathersjs/hooks/lib";
  
export const ContextInjecterMW = async (
    ctx: HookContext,
    next: NextFunction
  ) => { 
    ctx.arguments.push(ctx);
    await next();
}; 
 