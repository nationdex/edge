import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { EdgeError } from "../../core/errors";
import { getTable } from "../../core/utils";
import { readFileSync } from "fs";

export default defineFunction({
    name: "$importCache",
    description: "Imports entries from a JSON file into a cache table",
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
        const cache = getTable(table);
        let data: any;
        try {
            data = JSON.parse(readFileSync(file, "utf8"));
        } catch (error: any) {
            throw new EdgeError(`Cannot import "${file}": ${error.message}`);
        }
        if (data === null || typeof data !== "object" || Array.isArray(data)) {
            throw new EdgeError(`Cannot import "${file}": expected a JSON object`);
        }
        for (const key in data) cache.set(key, data[key]);
        return this.success();
    }
});
