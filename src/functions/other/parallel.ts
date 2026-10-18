import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";

export default defineFunction({
    name: "$parallel",
    description: "Runs multiple code blocks in parallel and returns all results as an array",
    version: "1.0.0",
    output: ArgType.Json,
    brackets: true,
    unwrap: false,
    args: [
        {
            name: "code",
            description: "Code block to run in parallel",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    async execute(ctx) {
        const self = this as any;
        const fields = this.data.fields!;
        const len = fields.length;
        const promises = new Array(len);
        for (let i = 0; i < len; i++) {
            promises[i] = self.resolveCode(ctx, fields[i]);
        }
        const results = await Promise.all(promises);
        const values = new Array(len);
        for (let i = 0; i < len; i++) {
            values[i] = results[i].value;
        }
        return this.successJSON(values);
    }
});
