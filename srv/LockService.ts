import { ApplicationService } from "@sap/cds";
import { TableLockHandlerService} from "./src/Service/LockHandler";
import { container } from "./src/Cache/ContainerConfig";
import { TableLockHashMap } from "./src/Cache/LockMap";
import { LockDetails, TableKeys } from "./src/CommonTypes/CommonTypes";

export = (srv: ApplicationService) => {

    srv.on("acquireLock", async function (req) {
        const service: TableLockHandlerService = new TableLockHandlerService();
        const resp = await service.acquireLock(req);
        return resp;
    });

    srv.on("releaseLock", async function (req) {
        const service: TableLockHandlerService = new TableLockHandlerService();
        const resp = await service.releasLock(req);
        return resp;
    });

    srv.on("viewLockCache", function () {
        const cache: TableLockHashMap = container.get<TableLockHashMap>('cacheLockMap');
        const map: Map<String, LockDetails> = cache.getCacheMap();
        const arrayOfObjects = Array.from(map).map(([key, value]) => ({
            key: key,
            value: value
        }));
        return arrayOfObjects;
    });

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
