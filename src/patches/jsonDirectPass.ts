import { Context } from "@tryforge/forgescript";

const original = Context.prototype.getEnvironmentKey;

Context.prototype.getEnvironmentKey = function (this: any, ...args: string[]) {
    const arg = args[0];
    if (arg.startsWith("[") || arg.startsWith("{")) {
        try {
            const parsed = JSON.parse(arg);
            if (args.length === 1) return parsed;
            return Context.traverseGetValue(parsed, ...args.slice(1));
        } catch {
            // it just works ¯\_(ツ)_/¯
        }
    }
    return original.call(this, ...args);
};
