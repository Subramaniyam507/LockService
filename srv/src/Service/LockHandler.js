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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableLockHandlerService = void 0;
const ContainerConfig_1 = require("../Cache/ContainerConfig");
const Utiltity_1 = require("../Utility/Utiltity");
const constants = require("../constants/constants.json");
class TableLockHandlerService {
    constructor() {
        // Constructor logic if needed
    }
    acquireLock(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tables = req.data.request.tables;
            if (!Utiltity_1.Utility.validateTables(tables)) {
                req.reject(480, constants.acquireLockConstants.invalidTableMessage);
            }
            if (!Utiltity_1.Utility.validateApplication(req.data.request.ricef)) {
                req.reject(489, constants.acquireLockConstants.invalidApplication);
            }
            const resp = this.grantLock(req);
            return resp;
        });
    }
    grantLock(req) {
        const tableLockHashMap = ContainerConfig_1.container.get('cacheLockMap');
        const key = {
            fields: req.data.request.fields.sort(),
            tables: req.data.request.tables.sort()
        };
        if (tableLockHashMap.hasKey(key)) {
            const lockDetails = tableLockHashMap.get(key);
            // Locked by some other user
            if (lockDetails && lockDetails.isLocked === true && lockDetails.user !== req.data.request.user) {
                const message = `${constants.acquireLockConstants.lockedByAnotherUser} ${lockDetails.user}`;
                return this.prepareLockResponse(false, message);
            }
            // Locked by the same user in a different application
            else if (lockDetails && lockDetails.isLocked === true && lockDetails.user === req.data.request.user && lockDetails.app_id !== req.data.request.ricef) {
                const message = `${constants.acquireLockConstants.lockedInDifferentApplication} ${req.data.request.user} in another application ${lockDetails.app_id}`;
                return this.prepareLockResponse(false, message);
            }
            // Refresh the lock expiry
            else {
                const value = {
                    isLocked: true,
                    app_id: req.data.request.ricef,
                    user: req.data.request.user
                };
                tableLockHashMap.set(key, value);
                console.log(tableLockHashMap);
                this.setTimeouts(key);
                const message = `${constants.acquireLockConstants.lockSuccess} for ${req.data.request.user}`;
                return this.prepareLockResponse(true, message);
            }
        }
        // new lock registation
        else {
            const value = {
                isLocked: true,
                app_id: req.data.request.ricef,
                user: req.data.request.user
            };
            tableLockHashMap.set(key, value);
            console.log(tableLockHashMap);
            this.setTimeouts(key);
            const message = `${constants.acquireLockConstants.lockSuccess} for ${req.data.request.user}`;
            return this.prepareLockResponse(true, message);
        }
    }
    prepareLockResponse(isLocked, message) {
        const response = {
            isLocked: isLocked,
            message: message
        };
        return response;
    }
    prepareUnlockResponse(isLockReleased, message) {
        const response = {
            isLockReleased: isLockReleased,
            message: message
        };
        return response;
    }
    checkLock(record) {
        return __awaiter(this, void 0, void 0, function* () {
            const tableLockHashMap = ContainerConfig_1.container.get('cacheLockMap');
            let lockDetails;
            let key = {
                fields: record.fields.sort(),
                tables: record.tables.sort()
            };
            if (tableLockHashMap.hasKey(key)) {
                lockDetails = tableLockHashMap.get(key);
                return lockDetails;
            }
            else {
                lockDetails = {
                    isLocked: false,
                    app_id: "",
                    user: ""
                };
                return lockDetails;
            }
        });
    }
    setTimeouts(key) {
        const tableLockHashMap = ContainerConfig_1.container.get('cacheLockMap');
        setTimeout(() => {
            tableLockHashMap.delete(key);
        }, constants.acquireLockConstants.timeouts.keyTimeout);
        setTimeout(() => {
            if (tableLockHashMap.hasKey(key)) {
                const lockDetails = tableLockHashMap.get(key);
                if (lockDetails) {
                    lockDetails.isLocked = false;
                    lockDetails.user = "";
                    lockDetails.app_id = "";
                    tableLockHashMap.set(key, lockDetails);
                }
            }
        }, constants.acquireLockConstants.timeouts.lockTimeout);
    }
    releasLock(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const tables = req.data.request.tables;
            if (!Utiltity_1.Utility.validateTables(tables)) {
                req.reject(400, constants.acquireLockConstants.invalidTableMessage);
            }
            if (!Utiltity_1.Utility.validateApplication(req.data.request.ricef)) {
                req.reject(400, constants.acquireLockConstants.invalidApplication);
            }
            const result = this.expireLock(req);
            return result;
        });
    }
    expireLock(req) {
        const tableLockHashMap = ContainerConfig_1.container.get('cacheLockMap');
        const key = {
            fields: req.data.request.fields.sort(),
            tables: req.data.request.tables.sort()
        };
        if (tableLockHashMap.hasKey(key)) {
            let lockDetails = tableLockHashMap.get(key);
            // Release lock if it belongs to the same user and application
            if (lockDetails && lockDetails.isLocked && lockDetails.user === req.data.request.user && lockDetails.app_id === req.data.request.ricef) {
                lockDetails.isLocked = false;
                lockDetails.user = "";
                tableLockHashMap.set(key, lockDetails);
                const result = this.prepareUnlockResponse(true, constants.acquireLockConstants.releaseLockConstants.lockReleaseSuccess);
                return result;
            }
            // Attempt to release lock created by another user
            else if (lockDetails && lockDetails.isLocked && lockDetails.user !== req.data.request.user) {
                const result = this.prepareUnlockResponse(false, constants.acquireLockConstants.releaseLockConstants.lockOwnershipFailure);
                return result;
            }
            // Same user trying to release lock from another app
            else if (lockDetails && lockDetails.isLocked && lockDetails.user === req.data.request.user && lockDetails.app_id !== req.data.request.ricef) {
                const message = `${constants.acquireLockConstants.releaseLockConstants.differentAppLock} ${req.data.request.user} from ${lockDetails.app_id}`;
                const result = this.prepareUnlockResponse(false, message);
                return result;
            }
            // Edge condition: lock got cleared, nothing to unlock
            else {
                const message = constants.acquireLockConstants.releaseLockConstants.notLockedYet;
                const result = this.prepareUnlockResponse(false, message);
                return result;
            }
        }
        else {
            // Lock was not registered to unlock
            const result = this.prepareUnlockResponse(false, constants.acquireLockConstants.releaseLockConstants.noExistingLock);
            return result;
        }
    }
}
exports.TableLockHandlerService = TableLockHandlerService;
