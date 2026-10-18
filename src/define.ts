import { NativeFunction } from "@tryforge/forgescript";
import type { IArg, INativeFunction } from "@tryforge/forgescript";
import { EdgeError } from "./core/errors";

/**
 * `new NativeFunction(...)` whose `execute` reports an `EdgeError` as a
 * ForgeScript error instead of letting it escape as an exception.
 */
export function defineFunction<T extends [...IArg[]], Unwrap extends boolean = boolean>(
    data: INativeFunction<T, Unwrap>
): NativeFunction<T, Unwrap> {
    const execute = data.execute as (...args: any[]) => any;
    const handle = (self: any, error: unknown) => {
        if (error instanceof EdgeError) return self.customError(error.message);
        throw error;
    };
    const wrapped = function (this: any, ...args: any[]) {
        try {
            const result = execute.apply(this, args);
            return result instanceof Promise ? result.catch((error) => handle(this, error)) : result;
        } catch (error) {
            return handle(this, error);
        }
    };
    Object.defineProperty(wrapped, Symbol.toStringTag, { value: (execute as any)[Symbol.toStringTag] });
    return new NativeFunction({ ...data, execute: wrapped as any });
}
