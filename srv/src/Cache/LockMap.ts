import { injectable } from "inversify";
import { LockDetails, TableKeys } from "../CommonTypes/CommonTypes";
import { KeySerializer } from "../Serializer/KeySerializer";

/**
 * Service providing a hash map for managing locks associated with table keys.
 * @remarks
 * This class uses an Inversion of Control (IoC) container and dependency injection via Inversify.
 */
@injectable()
export class TableLockHashMap {
    /**
     * Internal map storing lock details associated with serialized table keys.
     * @private
     */
    private cacheLockMap: Map<string, LockDetails>;

    /**
     * Constructs a new instance of the TableLockHashMap class.
     * Initializes the internal cacheLockMap.
     */
    constructor() {
        this.cacheLockMap = new Map<string, LockDetails>();
    }

    /**
     * Retrieves the entire cache map containing table keys and associated lock details.
     * @returns The cache map.
     */
    public getCacheMap() {
        return this.cacheLockMap;
    }

    /**
     * Sets a lock entry in the cache map for the specified table key.
     * @param key - The table key.
     * @param value - The lock details associated with the key.
     */
    public set(key: TableKeys, value: LockDetails) {
        this.cacheLockMap.set(KeySerializer.serialize(key), value);
    }

    /**
     * Retrieves the lock details for the specified table key from the cache map.
     * @param key - The table key.
     * @returns The lock details associated with the key, or undefined if not found.
     */
    public get(key: TableKeys) {
        return this.cacheLockMap.get(KeySerializer.serialize(key));
    }

    /**
     * Deletes the lock entry for the specified table key from the cache map.
     * @param key - The table key.
     * @returns True if the lock entry was successfully deleted, false otherwise.
     */
    public delete(key: TableKeys) {
        return this.cacheLockMap.delete(KeySerializer.serialize(key));
    }

    /**
     * Checks if the cache map contains a lock entry for the specified table key.
     * @param key - The table key.
     * @returns True if the cache map contains a lock entry for the key, false otherwise.
     */
    public hasKey(key: TableKeys) {
        return this.cacheLockMap.has(KeySerializer.serialize(key));
    }
}
