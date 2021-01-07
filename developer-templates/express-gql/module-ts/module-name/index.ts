import _resolvers from "./resolver";
import { readFileSync } from "fs";
export const ModuleNameModuleTypeDefs = {
  types: readFileSync(
    "./src/modules/module-name/types/graphql/types.graphql",
    "utf-8"
  ),
  query: readFileSync(
    "./src/modules/module-name/types/graphql/query.graphql",
    "utf-8"
  ),
  mutation: readFileSync(
    "./src/modules/module-name/types/graphql/mutation.graphql",
    "utf-8"
  ),
};
export const ModuleNameModuleResolver = _resolvers;
