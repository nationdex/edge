import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { EdgeError } from "../../core/errors";
import { getTable } from "../../core/utils";
import { writeFileSync } from "fs";

export default defineFunction({
    name: "$exportCache",
    description: "Exports all entries from a cache table to a JSON file",
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
            name: "file",
            description: "The file path",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [table, file]) {
        const data: Record<string, unknown> = {};
        for (const item of getTable(table)) data[item[0]] = item[1];
        try {
            writeFileSync(file, JSON.stringify(data));
        } catch (error: any) {
            throw new EdgeError(`Cannot write "${file}": ${error.message}`);
        }
        return this.success();
    }
});
