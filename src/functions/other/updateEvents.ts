import { defineFunction } from "../../define";
import { updateEvents } from "../../core/events";

export default defineFunction({
    name: "$updateEvents",
    description: "Updates all events routes",
    version: "1.0.0",
    unwrap: false,
    async execute(ctx) {
        await updateEvents();
        return this.success();
    }
});
