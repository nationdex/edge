import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { caches, getTable } from "../../core/utils";

export default defineFunction({
    name: "$clearCache",
    description: "Clears cached data, clearing all tables if no table is provided",
    version: "1.0.0",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "table",
            description: "The table name",
            type: ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [table]) {
        if (table) {
            getTable(table).clear();
        } else {
            for (const item of caches) item[1].clear();
        }
        return this.success();
    }
});
