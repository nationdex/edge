import { Context, Logger } from "@tryforge/forgescript";
import { join, extname, basename } from "path";
import { clearCache, scanDirectory } from "./fs";

const structures = new Map<string, any>();
const wildcards: { prefix: string; data: any }[] = [];
let path: string | null = null;

const unsafeKeys = new Set(["__proto__", "constructor", "prototype"]);

export function isUnsafeKey(key: string): boolean {
    return unsafeKeys.has(key);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cloneDefault(value: any): any {
    return value !== null && typeof value === "object" ? structuredClone(value) : value;
}

export function getStructure(root: string): any {
    const exact = structures.get(root);
    if (exact !== undefined) return exact;
    for (let i = 0, len = wildcards.length; i < len; i++) {
        const item = wildcards[i];
        if (root.startsWith(item.prefix)) return item.data;
    }
    return undefined;
}

function mergeWithDefault(value: any, def: any): any {
    if (isPlainObject(value) && isPlainObject(def)) {
        const result: Record<string, unknown> = { ...value };
        for (const key in def) {
            if (isUnsafeKey(key)) continue;
            result[key] = key in value ? mergeWithDefault(value[key], def[key]) : cloneDefault(def[key]);
        }
        return result;
    }
    if (Array.isArray(value) && Array.isArray(def)) {
        const result = value.slice();
        for (let i = 0, len = def.length; i < len; i++) {
            result[i] = i in value ? mergeWithDefault(value[i], def[i]) : cloneDefault(def[i]);
        }
        return result;
    }
    return value !== undefined ? value : cloneDefault(def);
}

/**
 * Fills a value with the defaults declared by the structure matching `root`.
 * Requires the `structureDefaults` feature and a loaded structures folder.
 */
export function resolveDefault(value: unknown, root: string, ...path: string[]): unknown {
    if (value !== undefined && !isPlainObject(value) && !Array.isArray(value)) return value;
    const def = Context.traverseGetValue(getStructure(root), ...path) as any;
    if (isPlainObject(value) && isPlainObject(def)) return mergeWithDefault(value, def);
    if (Array.isArray(value) && Array.isArray(def)) return mergeWithDefault(value, def);
    return value !== undefined ? value : cloneDefault(def);
}

export async function updateStructures(dir?: string): Promise<void> {
    if (!path) {
        if (!dir) return;
        path = join(process.cwd(), dir);
    }
    const paths = await scanDirectory(path, ".json");
    const nextStructures = new Map<string, any>();
    const nextWildcards: { prefix: string; data: any }[] = [];
    for (const file of paths) {
        const name = basename(file, extname(file));
        let data: any;
        try {
            clearCache(file);
            data = require(file);
        } catch (error) {
            Logger.error(`[QuorielEdge] Skipped structure ${file}: ${(error as Error).message}`);
            continue;
        } finally {
            clearCache(file);
        }
        if (name.endsWith("*")) {
            const prefix = name.slice(0, -1);
            nextWildcards.push({ prefix, data });
            nextStructures.set(prefix, data);
        } else {
            nextStructures.set(name, data);
        }
    }
    nextWildcards.sort((a, b) => b.prefix.length - a.prefix.length);
    structures.clear();
    for (const [key, value] of nextStructures) structures.set(key, value);
    wildcards.length = 0;
    wildcards.push(...nextWildcards);
}

export { structures };
