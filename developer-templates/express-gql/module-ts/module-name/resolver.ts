import { Injector } from "graphql-modules";
import { IContext } from "../../types/context.type";
import { ModuleNameService } from "./services/ModuleName.service";

const resolver = {
  Query: {
    moduleNameSearch: (
      _: any,
      args: {
        moduleName_status: number;
        moduleName_type: number;
        keyword: string;
        limit: number;
        skip: number;
      },
      ctx: IContext
    ) => {
      return (ctx.injector as Injector)
        .get(ModuleNameService)
        .SearchModuleNames(
          ctx.me.id,
          args.moduleName_status,
          args.moduleName_type,
          args.keyword,
          args.limit,
          args.skip
        );
    },
    moduleNameGet: (_: any, args: { moduleName_id: number }, ctx: IContext) => {
      return (ctx.injector as Injector)
        .get(ModuleNameService)
        .findById(ctx.me.id, args.moduleName_id);
    },
    moduleNameRecentList: (_: any, args: any, ctx: IContext) => {
      return (ctx.injector as Injector)
        .get(ModuleNameService)
        .listRecentModuleNames(ctx.me.id);
    },
  },
  Mutation: {
    moduleNameCreate: (_: any, args: { input: any }, ctx: IContext) => {
      console.log(ctx.me, args);
      return (ctx.injector as Injector)
        .get(ModuleNameService)
        .createItem(ctx.me.id, ctx.me.email, args.input);
    },
    ModuleNameUpdate: (
      _: any,
      args: { input: { itemId: number; item: any } },
      ctx: IContext
    ) => {
      return (ctx.injector as Injector)
        .get(ModuleNameService)
        .update(ctx.me.id, args.input.itemId, args.input.item);
    },
    moduleNameDelete: (_: any, args: { itemId: number }, ctx: IContext) => {
      return (ctx.injector as Injector)
        .get(ModuleNameService)
        .delete(ctx.me.id, args.itemId);
    },
  },
};

export default resolver;
