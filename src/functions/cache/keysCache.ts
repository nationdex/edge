import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { caches } from "../../core/utils";

export default new NativeFunction({
    name: "$keysCache",
    description: "Returns all keys from the cache joined by a separator",
    version: "1.0.0",
    output: ArgType.String,
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
            name: "separator",
            description: "The separator",
            type: ArgType.String,
            rest: false
        }
    ],
    execute(ctx, [table, separator]) {
        return this.success([...caches.get(table)!.keys()].join(separator || ", "));
    }
});
