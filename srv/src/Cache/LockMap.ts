import { injectable } from "inversify";
import { LockDetails, TableKeys } from "../CommonTypes/CommonTypes";
import { KeySerializer } from "../Serializer/KeySerializer";


@injectable()
export class TableLockHashMap {
   
    private cacheLockMap: Map<string, LockDetails>;

   
    constructor() {
        this.cacheLockMap = new Map<string, LockDetails>();
    }

  
    public getCacheMap() {
        return this.cacheLockMap;
    }

    public set(key: TableKeys, value: LockDetails) {
        this.cacheLockMap.set(KeySerializer.serialize(key), value);
    }

    public get(key: TableKeys) {
        return this.cacheLockMap.get(KeySerializer.serialize(key));
    }

  
    public delete(key: TableKeys) {
        return this.cacheLockMap.delete(KeySerializer.serialize(key));
    }

  
    public hasKey(key: TableKeys) {
        return this.cacheLockMap.has(KeySerializer.serialize(key));
    }
}
