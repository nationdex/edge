import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { getTable } from "../../core/utils";

export default defineFunction({
    name: "$setCache",
    description: "Sets a cache variable to the specified value",
    version: "1.0.0",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "table",
            description: "The table name",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "name",
            description: "Variable name",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "value",
            description: "New value",
            type: ArgType.Json,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [table, name, value]) {
        getTable(table).set(name, value);
        return this.success();
    }
});
