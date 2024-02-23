"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySerializer = void 0;
/**
 * Utility class for serializing TableKeys using JSON.stringify.
 * @class
 */
class KeySerializer {
    /**
     * Serializes a TableKeys object into a JSON-formatted string.
     * @static
     * @param {TableKeys} key - The TableKeys object to be serialized.
     * @returns {string} The serialized JSON string.
     */
    static serialize(key) {
        return JSON.stringify(key);
    }
}
exports.KeySerializer = KeySerializer;
