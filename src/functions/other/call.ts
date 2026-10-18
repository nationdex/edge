import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { EdgeError } from "../../core/errors";

export default defineFunction({
    name: "$call",
    description: "Calls a local JS function defined in the command file",
    version: "1.0.0",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "name",
            description: "Function name",
            type: ArgType.String,
            required: true,
            rest: false
        },
        {
            name: "args",
            description: "Arguments to pass to the function",
            type: ArgType.Json,
            required: false,
            rest: true
        }
    ],
    async execute(ctx, [name, args]) {
        const fn = (ctx.cmd?.data as any)?.functions?.[name];
        if (typeof fn !== "function") {
            throw new EdgeError(`Local function "${name}" is not defined in this command file`);
        }
        return this.successJSON(await fn(...args));
    }
});
