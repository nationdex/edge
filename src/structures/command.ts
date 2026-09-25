import type { CommandData } from "../types";

let id = 0;

/**
 * A loaded command or interaction module.
 */
export class Command {
    /**
     * Unique identifier assigned on construction.
     */
    id = `edge_${++id}`;

    data: CommandData;

    constructor(data: CommandData) {
        this.data = { ...data };
    }

    /**
     * Whether `name`, `code` and a known `type` are present.
     */
    validate(): boolean {
        return !!this.data.name && !!this.data.code && (this.data.type === "messageCreate" || this.data.type === "interactionCreate");
    }
}
