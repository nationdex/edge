import { Emitter } from "@eolthar/events";
import { Interpreter, Compiler, ForgeClient, Logger } from "@tryforge/forgescript";
import { clearCache, scanDirectory } from "./fs";
import { extractFunctions } from "./extract";
import { Command } from "../structures/command";
import { compileAllowed, compileRules, compileOnly, matchesOnly } from "./matchers";
import { join } from "path";
import type { QuorielEdgeOptions } from "../types";

const interactions = new Emitter();
const commands = new Emitter();

const paths = new Set<string>();

interface PrefixEntry {
    compiled: ReturnType<typeof Compiler.compile> | null;
    static: string | null;
}

const prefixes = new Set<PrefixEntry>();

let client: ForgeClient | null = null;

export function initEvents(secret: ForgeClient, options: QuorielEdgeOptions): void {
    client = secret;
    if (options?.prefixes) {
        for (const value of options.prefixes) {
            const is = value.includes("$");
            prefixes.add({
                compiled: is ? Compiler.compile(value) : null,
                static: is ? null : value
            });
        }
    }
    const sep = options.separator || "-";
    if (options.events?.includes("interactionCreate")) {
        client.on("interactionCreate", (interaction: any) => {
            try {
                if (interaction.isChatInputCommand()) return;
                const raw = interaction.customId || interaction.commandName;
                if (typeof raw !== "string" || !raw) return;
                const sp = raw.indexOf(sep);
                interactions.emit(sp !== -1 ? raw.substring(0, sp) : raw, interaction);
            } catch (error) {
                Logger.error(error as any);
            }
        });
    }
    if (options.events?.includes("messageCreate")) {
        client.on("messageCreate", async (message: any) => {
            try {
                if (typeof message.content !== "string") return;
                const content = message.content.trim();
                const sp = content.indexOf(" ");
                const raw = (sp !== -1 ? content.substring(0, sp) : content).toLowerCase();
                if (!raw) return;
                const prefix = await getPrefix(message, raw);
                const name = prefix ? raw.substring(prefix.length) : raw;
                commands.emit(name, message, sp !== -1 ? content.substring(sp + 1) : "", prefix !== null);
            } catch (error) {
                Logger.error(error as any);
            }
        });
    }
}

async function getPrefix(message: any, raw: string): Promise<string | null> {
    for (const value of prefixes) {
        const resolved =
            value.static ??
            ((await Interpreter.run({
                client: client!,
                command: null,
                data: value.compiled!,
                obj: message,
                doNotSend: true
            })) as unknown as string);
        if (typeof resolved === "string" && resolved && raw.startsWith(resolved)) return resolved;
    }
    return null;
}

function registerCommand(cmd: Command, compiled: ReturnType<typeof Compiler.compile>): void {
    if (cmd.data.type === "messageCreate") {
        const filter = compileRules(cmd.data.rules);
        const only = compileOnly(cmd.data.only);
        const handler = async (message: any, rawArgs: string, hasPrefix: boolean) => {
            try {
                if (!filter(message, hasPrefix)) return;
                if (!(await matchesOnly(only, message, client))) return;
                const args = rawArgs ? rawArgs.trim().split(/ +/g).filter(Boolean) : [];
                await Interpreter.run({ obj: message, client: client!, data: compiled, command: cmd as any, args, states: { message: { new: message } } });
            } catch (error) {
                Logger.error(error as any);
            }
        };
        registerHandler(commands, cmd, handler);
    } else {
        const checker = compileAllowed(cmd.data.allowed);
        const handler = async (interaction: any) => {
            try {
                if (!checker(interaction)) return;
                await Interpreter.run({ obj: interaction, client: client!, data: compiled, command: cmd as any, args: [] });
            } catch (error) {
                Logger.error(error as any);
            }
        };
        registerHandler(interactions, cmd, handler);
    }
}

function loadFiles(files: string[]): void {
    for (const file of files) {
        try {
            const raw = require(file);
            const mod = raw?.default ?? raw;
            const entries = Array.isArray(mod) ? mod : [mod];
            let functions: ReturnType<typeof extractFunctions> | null = null;
            for (const item of entries) {
                if (!item) continue;
                try {
                    const cmd = item instanceof Command ? item : new Command(item);
                    if (!cmd.validate()) {
                        Logger.warn(`[QuorielEdge] Skipped an invalid module in ${file}`);
                        continue;
                    }
                    const compiled = Compiler.compile(cmd.data.code);
                    cmd.data.path = file;
                    cmd.data.functions = functions ??= extractFunctions(file);
                    registerCommand(cmd, compiled);
                } catch (error) {
                    Logger.error(error as any);
                }
            }
        } catch (error) {
            Logger.error(error as any);
        }
    }
}

function registerHandler(map: Emitter, cmd: Command, handler: (...args: any[]) => unknown): void {
    map.on(cmd.data.name, handler as any);
    if (cmd.data.aliases) {
        for (const alias of cmd.data.aliases) {
            map.on(alias, handler as any);
        }
    }
}

export async function loadEvents(path: string): Promise<void> {
    const resolved = join(process.cwd(), path);
    paths.add(resolved);
    return loadFiles(await scanDirectory(resolved, ".js"));
}

export async function updateEvents(): Promise<void> {
    interactions.clear();
    commands.clear();
    for (const dir of paths) {
        const files = await scanDirectory(dir, ".js");
        for (const file of files) clearCache(file);
        loadFiles(files);
    }
}
