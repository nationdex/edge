import { ForgeExtension, ForgeClient } from "@tryforge/forgescript";
import { Command } from "./structures/command";
import { initEvents, loadEvents } from "./core/events";
import { updateStructures, resolveDefault } from "./core/structures";
import { features, initUtils } from "./core/utils";
import { extractFunctions } from "./core/extract";
import type { Loader, QuorielEdgeOptions } from "./types";

const { description, version } = require("../package.json") as { description: string; version: string };

/**
 * ForgeScript extension exposing an extended set of functions.
 */
export class QuorielEdge extends ForgeExtension {
    name = "QuorielEdge";
    description = description;
    version = version;

    options?: QuorielEdgeOptions;

    /**
     * Loads a folder of `messageCreate` and `interactionCreate` modules.
     */
    commands: Loader;

    /**
     * Loads a folder of JSON schemas holding default environment values.
     */
    structures: Loader;

    constructor(options?: QuorielEdgeOptions) {
        super();
        this.options = options;
        this.commands = {
            load: (path: string) => loadEvents(path)
        };
        this.structures = {
            load: (path: string) => updateStructures(path)
        };
    }

    init(client: ForgeClient): void {
        this.load(__dirname + "/functions");
        if (this.options?.features) {
            for (const name of this.options.features) require("./patches/" + name);
        }
        initUtils(this.options);
        if (this.options?.events) {
            initEvents(client, this.options);
        }
    }
}

export { Command, resolveDefault, extractFunctions, features };
