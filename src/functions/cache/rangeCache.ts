import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { getTable } from "../../core/utils";

export default defineFunction({
    name: "$rangeCache",
    description: "Retrieves all entries from the cache",
    version: "1.0.0",
    output: ArgType.Json,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "table",
            description: "The table name",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [table]) {
        const result: { key: string; value: unknown }[] = [];
        for (const item of getTable(table)) result.push({ key: item[0], value: item[1] });
        return this.successJSON(result as any);
    }
});
