import { Inject, Injectable } from "graphql-modules";
import {
  CanSearch,
  SQLQueryConnectorWith,
  SQLQueryFullTextConnector,
} from "../../../libs/pg/QueryBuilder";
import { IModuleName, ModuleNameStatus } from "../../../models/ModuleName";
import { IModuleNamePermission } from "../../../models/ModuleName.permission";
import { IPaginatedResult } from "../../../types/paginatedResult";
import { validInput } from "../../../utils/Utils";
import { DBService } from "../../app/services/db.service";

import { AppLogger } from "../../shared/logger";
@Injectable()
export class ModuleNameService {
  constructor(private db: DBService) {}

  async createItem(id: number, email: string, item: IModuleName) {
    try {
      console.log(id, item);
      item.created_by = id;

      item.ModuleName_status = ModuleNameStatus.active;

      item.created_at = "now()";
      item.updated_at = "now()";
      const createdItem = await this.db.moduleName.createOne(
        item,
        "id,created_at,updated_at"
      );

      TODO: "notification";
      console.log(createdItem);
      return createdItem;
    } catch (err) {
      throw AppLogger.ThowError("100:006", err);
    }
  }

  async delete(userId: number, itemId: number) {
    try {
      const { ModuleName } = await this.findById(userId, itemId, false);
      if (ModuleName) {
        throw "ModuleName not found";
      }
      ModuleName.updated_at = "now()";
      ModuleName.ModuleName_status = ModuleNameStatus.deleted;

      await this.db.moduleName.updateById(itemId, ModuleName, "updated_at");

      TODO: "notification";

      return {
        id: itemId,
        delete_status: "Soft Deleted",
      };
    } catch (err) {
      throw AppLogger.ThowError("100:009", err);
    }
  }
  async update(userId: number, itemId: number, item: IModuleName) {
    try {
      const { ModuleName } = await this.findById(userId, itemId, false);
      if (ModuleName == null) {
        throw "ModuleName not found";
      }

      item.updated_at = "now()";

      const res = await this.db.moduleName.updateById(
        itemId,
        item,
        "updated_at"
      );

      TODO: "notification";
      return {
        id: itemId,
        update_status: "Updated",
        updated_at: res.updated_at,
      };
    } catch (err) {
      throw AppLogger.ThowError("100:008", err);
    }
  }
  async findById(
    userId: number,
    id: number
  ): Promise<{ ModuleName: IModuleName }> {
    try {
      const foundItem = await this.db.moduleName.findById(id);
      if (foundItem == null) {
        throw "ModuleName not found";
      }

      return { ModuleName: foundItem };
    } catch (err) {
      throw AppLogger.ThowError("100:005", err);
    }
  }

  /**
   * Search ModuleNames
   * search only can view for me
   * @param userId
   */
  async SearchModuleNames(
    userId: number,
    ModuleNameStatus: number,
    ModuleNameType: number,
    keyword: string,
    limit: number,
    skip: number
  ) {
    try {
      const ModuleNameTableName = this.db.moduleName.tableName;
      const ModuleNamePermissionTableName = this.db.ModuleNamePermissionModel
        .tableName;

      let queryPart1 = ` ${ModuleNamePermissionTableName}.user_id=$1 AND  ${ModuleNamePermissionTableName}.permission_status=2 `;
      let queryPart2 = "";

      // if (CanSearch(ModuleNameStatus, true)) {
      //   queryPart2 += ` ${ModuleNameTableName}.ModuleName_status=`;
      //   queryPart2 += `${+("" + ModuleNameStatus)} `;
      // }
      // if (CanSearch(ModuleNameType, true)) {
      //   if (queryPart2.length > 1) {
      //     queryPart2 += " AND ";
      //   }
      //   queryPart2 += ` ${ModuleNameTableName}.ModuleName_type=`;
      //   queryPart2 += `${+("" + ModuleNameType)} `;
      // }

      // if (CanSearch(keyword)) {
      //   if (queryPart2.length > 1) {
      //     queryPart2 += " AND ";
      //   }
      //   keyword = keyword.replace(/[\W]+/g, " ");

      //   queryPart2 += ` ( ${ModuleNameTableName}.name ILIKE '%`;
      //   queryPart2 += keyword;
      //   queryPart2 += `%'`;
      //   queryPart2 += ` OR  ${ModuleNameTableName}.description ILIKE '%`;
      //   queryPart2 += keyword + `%' `;

      //   console.log(+("" + keyword));
      //   if (CanSearch(+("" + keyword), true) && parseInt(keyword) > 0) {
      //     queryPart2 += ` OR  ${ModuleNameTableName}.id =${keyword}`;
      //   }
      //   queryPart2 += ` ) `;
      // }

      // let queryPart = queryPart1;
      // if (queryPart2.length > 1) {
      //   queryPart += " AND " + queryPart2;
      // }
      // let bodyPart = `FROM ${ModuleNameTableName} `;
      // bodyPart += `INNER JOIN ${ModuleNamePermissionTableName} `;

      // bodyPart += `ON ${ModuleNameTableName}.id = ${ModuleNamePermissionTableName}.ModuleName_id  where ${queryPart} `;

      // const endPart = ` LIMIT $2 OFFSET $3 `;

      // let values = [userId, limit, skip];

      // //Building Select Query
      // let sql = `SELECT ${ModuleNameTableName}.*  , ${ModuleNamePermissionTableName}.id as perm_id, ${ModuleNamePermissionTableName}.last_updated as last_updated ,${ModuleNamePermissionTableName}.access_level as access_level `;
      // sql += bodyPart;
      // sql += `ORDER BY ${ModuleNamePermissionTableName}.last_updated DESC `;
      // sql += endPart;

      // //Building Count Query
      // let countQuery = `SELECT count(*) as total_rows `;
      // countQuery += bodyPart;

      const results = await Promise.all([
        this.db.pool.query({
          text: "countQuery",
          values: [userId],
        }),
        this.db.pool.query({
          text: "sql",
          values: "values",
        }),
      ]);
      const count = +results[0].rows[0].total_rows;
      const items: any[] = results[1].rows;

      const response: IPaginatedResult<any> = {
        resultCount: count,
        limit: limit,
        skip: skip,
        result: items,
      };
      // console.log(response);
      return response;
    } catch (err) {
      throw err;
    }
  }
}
