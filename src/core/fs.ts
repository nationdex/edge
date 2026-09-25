import { readdir } from "fs/promises";
import { join } from "path";

export async function scanDirectory(path: string, format: string): Promise<string[]> {
    const results: string[] = [];
    const files = await readdir(path, { withFileTypes: true });
    for (const file of files) {
        const full = join(path, file.name);
        if (file.isDirectory()) results.push(...(await scanDirectory(full, format)));
        else if (file.name.endsWith(format)) results.push(full);
    }
    return results;
}

export function clearCache(path: string, visited: Set<string> = new Set()): void {
    if (visited.has(path)) return;
    visited.add(path);
    const mod = require.cache[path];
    if (!mod) return;
    for (let i = 0, l = mod.children.length; i < l; i++) {
        clearCache(mod.children[i].id, visited);
    }
    delete require.cache[path];
}
