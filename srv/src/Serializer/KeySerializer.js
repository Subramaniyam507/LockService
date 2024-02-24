"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeySerializer = void 0;
class KeySerializer {
    static serialize(key) {
        return JSON.stringify(key);
    }
}
exports.KeySerializer = KeySerializer;
