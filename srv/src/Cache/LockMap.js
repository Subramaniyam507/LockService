"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableLockHashMap = void 0;
const inversify_1 = require("inversify");
const KeySerializer_1 = require("../Serializer/KeySerializer");
/**
 * Service providing a hash map for managing locks associated with table keys.
 * @remarks
 * This class uses an Inversion of Control (IoC) container and dependency injection via Inversify.
 */
let TableLockHashMap = class TableLockHashMap {
    /**
     * Constructs a new instance of the TableLockHashMap class.
     * Initializes the internal cacheLockMap.
     */
    constructor() {
        this.cacheLockMap = new Map();
    }
    /**
     * Retrieves the entire cache map containing table keys and associated lock details.
     * @returns The cache map.
     */
    getCacheMap() {
        return this.cacheLockMap;
    }
    /**
     * Sets a lock entry in the cache map for the specified table key.
     * @param key - The table key.
     * @param value - The lock details associated with the key.
     */
    set(key, value) {
        this.cacheLockMap.set(KeySerializer_1.KeySerializer.serialize(key), value);
    }
    /**
     * Retrieves the lock details for the specified table key from the cache map.
     * @param key - The table key.
     * @returns The lock details associated with the key, or undefined if not found.
     */
    get(key) {
        return this.cacheLockMap.get(KeySerializer_1.KeySerializer.serialize(key));
    }
    /**
     * Deletes the lock entry for the specified table key from the cache map.
     * @param key - The table key.
     * @returns True if the lock entry was successfully deleted, false otherwise.
     */
    delete(key) {
        return this.cacheLockMap.delete(KeySerializer_1.KeySerializer.serialize(key));
    }
    /**
     * Checks if the cache map contains a lock entry for the specified table key.
     * @param key - The table key.
     * @returns True if the cache map contains a lock entry for the key, false otherwise.
     */
    hasKey(key) {
        return this.cacheLockMap.has(KeySerializer_1.KeySerializer.serialize(key));
    }
};
exports.TableLockHashMap = TableLockHashMap;
exports.TableLockHashMap = TableLockHashMap = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], TableLockHashMap);
