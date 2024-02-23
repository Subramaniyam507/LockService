import { ApplicationService } from "@sap/cds";
import { TableLockHandlerService} from "./src/Service/LockHandler";
import { container } from "./src/Cache/ContainerConfig";
import { TableLockHashMap } from "./src/Cache/LockMap";
import { LockDetails, TableKeys } from "./src/CommonTypes/CommonTypes";

/**
 * Module exporting CAP (CDS) service definitions.
 * @module
 * @param {ApplicationService} srv - The CAP (CDS) service instance.
 */
export = (srv: ApplicationService) => {
  /**
     * Event handler for acquiring a lock.
     * @async
     * @param {object} req - The request object containing lock details.
     * @returns {Promise} A promise resolving to the lock response.
     */
    srv.on("acquireLock", async function (req) {
        const service: TableLockHandlerService = new TableLockHandlerService();
        const resp = await service.acquireLock(req);
        return resp;
    });
 /**
     * Event handler for releasing a lock.
     * @async
     * @param {object} req - The request object containing lock details.
     * @returns {Promise} A promise resolving to the unlock response.
     */
    srv.on("releaseLock", async function (req) {
        const service: TableLockHandlerService = new TableLockHandlerService();
        const resp = await service.releasLock(req);
        return resp;
    });
 /**
     * Event handler for viewing the lock cache.
     * @returns {Array} An array of objects representing lock cache entries.
     */
    srv.on("viewLockCache", function () {
        const cache: TableLockHashMap = container.get<TableLockHashMap>('cacheLockMap');
        const map: Map<String, LockDetails> = cache.getCacheMap();
        const arrayOfObjects = Array.from(map).map(([key, value]) => ({
            key: key,
            value: value
        }));
        return arrayOfObjects;
    });
 /**
     * Event handler for checking the lock status.
     * @async
     * @param {object} req - The request object containing key fields for lock status check.
     * @returns {Promise} A promise resolving to the lock details.
     */
    srv.on("checkLock",async function(req){
        let service:TableLockHandlerService = new TableLockHandlerService();
        const sorted:TableKeys = {
            fields:req.data.keyfields.fields.sort(),
            tables:req.data.keyfields.tables.sort()
        }
        const result = await service.checkLock(sorted);
        return result;
    })
};
