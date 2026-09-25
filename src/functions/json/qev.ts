import { NativeFunction, ArgType } from "@tryforge/forgescript";
import { resolveDefault } from "../../core/structures";

export default new NativeFunction({
    name: "$qev",
    description: "Retrieves an environment value with fallback to structure defaults",
    version: "1.0.0",
    output: ArgType.Unknown,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "key",
            description: "The keys to traverse",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    execute(ctx, [args]) {
        return this.successJSON(resolveDefault(ctx.getEnvironmentKey(...args), args[0], ...args.slice(1)) as any);
    }
});
