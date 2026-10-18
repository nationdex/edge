/**
 * Raised for problems caused by script input (unknown tables, missing files,
 * bad JSON). Native functions turn it into a regular ForgeScript error.
 */
export class EdgeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EdgeError";
    }
}
