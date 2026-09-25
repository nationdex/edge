import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { caches } from "../../core/utils";
import { writeFileSync } from "fs";

export default new NativeFunction({
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
        for (const item of caches.get(table)!) data[item[0]] = item[1];
        writeFileSync(file, JSON.stringify(data));
        return this.success();
    }
});
