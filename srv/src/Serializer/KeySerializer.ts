import { TableKeys } from "../CommonTypes/CommonTypes";

/**
 * Utility class for serializing TableKeys using JSON.stringify.
 * @class
 */
export class KeySerializer {
    /**
     * Serializes a TableKeys object into a JSON-formatted string.
     * @static
     * @param {TableKeys} key - The TableKeys object to be serialized.
     * @returns {string} The serialized JSON string.
     */
    public static serialize(key: TableKeys): string {
        return JSON.stringify(key);
    }
}
