import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { EdgeError } from "../../core/errors";
import { resolve } from "path";

export default defineFunction({
    name: "$require",
    description: "Dynamically loads the module",
    version: "1.0.0",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "path",
            description: "Module path",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [path]) {
        try {
            return this.successJSON(require(resolve(process.cwd(), path)));
        } catch (error: any) {
            throw new EdgeError(`Cannot require "${path}": ${error.message}`);
        }
    }
});
