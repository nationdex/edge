import { ArgType } from "@tryforge/forgescript";
import { defineFunction } from "../../define";
import { jsonMath } from "../../core/utils";

export default defineFunction({
    name: "$jsonSub",
    description: "Subtracts a number from a JSON key",
    version: "1.0.0",
    output: ArgType.Boolean,
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "keys;value",
            description: "Keys to traverse, last element is the target value",
            type: ArgType.String,
            required: true,
            rest: true
        }
    ],
    execute(ctx, [keys]) {
        return this.success(jsonMath(ctx, keys, (a, b) => a - b));
    }
});
