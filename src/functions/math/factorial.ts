import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";

export default defineFunction({
    name: "$factorial",
    description: "Calculates the factorial of a number",
    version: "1.0.0",
    output: ArgType.Number,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "number",
            description: "Number to calculate factorial",
            type: ArgType.Number,
            required: true,
            rest: false
        }
    ],
    execute(ctx, [number]) {
        let result = 1;
        for (let i = 2; i <= number; i++) result *= i;
        return this.success(result);
    }
});
