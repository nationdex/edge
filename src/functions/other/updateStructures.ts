import { defineFunction } from "../../define";
import { updateStructures } from "../../core/structures";

export default defineFunction({
    name: "$updateStructures",
    description: "Reloads all default value schemas from the previously loaded folder",
    version: "1.0.0",
    unwrap: false,
    async execute(ctx) {
        await updateStructures();
        return this.success();
    }
});
