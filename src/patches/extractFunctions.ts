import { BaseCommand } from "@tryforge/forgescript";
import { extractFunctions } from "../core/extract";

const original = BaseCommand.prototype.setPath;

BaseCommand.prototype.setPath = function (this: any, path: string) {
    original.call(this, path);
    if (path?.endsWith(".js")) {
        this.data.functions = extractFunctions(path);
    }
    return this;
};
