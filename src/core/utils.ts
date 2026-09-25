import { Context } from "@tryforge/forgescript";
import { resolveDefault } from "./structures";
import type { FeatureName, QuorielEdgeOptions } from "../types";

const caches = new Map<string, Map<string, unknown>>();
const featureSet = new Set<FeatureName>();

/**
 * The features the extension was initialised with. Populated by `init`,
 * empty before it runs.
 */
export const features: ReadonlySet<FeatureName> = featureSet;

export function initUtils(options?: QuorielEdgeOptions): void {
    if (options?.caches) {
        for (const name of options.caches) caches.set(name, new Map());
    }
    if (options?.features) {
        for (const name of options.features) featureSet.add(name);
    }
}

export function jsonMath(ctx: Context, keys: string[], op: (a: number, b: number) => number): boolean {
    const val = +keys.pop()!;
    const num: any = resolveDefault(ctx.getEnvironmentKey(...keys), keys[0], ...keys.slice(1));
    const nex = op(+num || 0, val);
    return ctx.traverseAddEnvironmentKey(typeof num === "string" ? nex + "" : nex, ...keys);
}

export { caches };
