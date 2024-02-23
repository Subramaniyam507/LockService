"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const LockHandler_1 = require("./src/Service/LockHandler");
const ContainerConfig_1 = require("./src/Cache/ContainerConfig");
module.exports = (srv) => {
    /**
       * Event handler for acquiring a lock.
       * @async
       * @param {object} req - The request object containing lock details.
       * @returns {Promise} A promise resolving to the lock response.
       */
    srv.on("acquireLock", function (req) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new LockHandler_1.TableLockHandlerService();
            const resp = yield service.acquireLock(req);
            return resp;
        });
    });
    /**
        * Event handler for releasing a lock.
        * @async
        * @param {object} req - The request object containing lock details.
        * @returns {Promise} A promise resolving to the unlock response.
        */
    srv.on("releaseLock", function (req) {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new LockHandler_1.TableLockHandlerService();
            const resp = yield service.releasLock(req);
            return resp;
        });
    });
    /**
        * Event handler for viewing the lock cache.
        * @returns {Array} An array of objects representing lock cache entries.
        */
    srv.on("viewLockCache", function () {
        const cache = ContainerConfig_1.container.get('cacheLockMap');
        const map = cache.getCacheMap();
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
    srv.on("checkLock", function (req) {
        return __awaiter(this, void 0, void 0, function* () {
            let service = new LockHandler_1.TableLockHandlerService();
            const sorted = {
                fields: req.data.keyfields.fields.sort(),
                tables: req.data.keyfields.tables.sort()
            };
            const result = yield service.checkLock(sorted);
            return result;
        });
    });
};
