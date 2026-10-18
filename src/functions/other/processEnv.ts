import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";

export default defineFunction({
    name: "$processEnv",
    description: "Gets the Node.js environment variable value",
    version: "1.0.0",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "name",
            description: "Environment variable name",
            type: ArgType.String,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [name]) {
        return this.success(process.env[name]);
    }
});
