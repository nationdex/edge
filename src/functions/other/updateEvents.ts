import { NativeFunction } from "@tryforge/forgescript";
import { updateEvents } from "../../core/events";

export default new NativeFunction({
    name: "$updateEvents",
    description: "Updates all events routes",
    version: "1.0.0",
    unwrap: false,
    async execute(ctx) {
        await updateEvents();
        return this.success();
    }
});
