"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const constants = __importStar(require("../constants/constants.json"));
/**
* Service for handling table locks.
* @class
*/
class TableLockHandlerService {
    constructor() {
        // Constructor logic if needed
    }
    /**
       * Attempts to acquire a lock based on the provided request.
       * @async
       * @param {any} req - The request object containing lock details.
       * @returns {Promise<LockResponse>} A promise resolving to the lock response.
       */
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
    /**
        * Grants a lock based on the provided request.
        * @private
        * @param {any} req - The request object containing lock details.
        * @returns {LockResponse} The lock response.
        */
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
    /**
   * Prepares a lock response with the specified parameters.
   * @private
   * @param {boolean} isLocked - Indicates whether the lock was successful.
   * @param {string} message - The message associated with the lock response.
   * @returns {LockResponse} The prepared lock response.
   */
    prepareLockResponse(isLocked, message) {
        const response = {
            isLocked: isLocked,
            message: message
        };
        return response;
    }
    /**
     * Prepares an unlock response with the specified parameters.
     * @private
     * @param {boolean} isLockReleased - Indicates whether the unlock was successful.
     * @param {string} message - The message associated with the unlock response.
     * @returns {UnlockResponse} The prepared unlock response.
     */
    prepareUnlockResponse(isLockReleased, message) {
        const response = {
            isLockReleased: isLockReleased,
            message: message
        };
        return response;
    }
    /**
    * Checks the lock status for the specified record.
    * @async
    * @param {TableKeys} record - The table keys representing the record.
    * @returns {Promise<LockDetails>} A promise resolving to the lock details.
    */
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
    /**
   * Sets timeouts for key expiration and lock refresh.
   * @private
   * @param {TableKeys} key - The table keys associated with the lock.
   */
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
    /**
   * Attempts to release a lock based on the provided request.
   * @async
   * @param {any} req - The request object containing lock details.
   * @returns {Promise<UnlockResponse>} A promise resolving to the unlock response.
   */
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
    /**
        * Expires a lock based on the provided request.
        * @private
        * @param {any} req - The request object containing lock details.
        * @returns {UnlockResponse} The unlock response.
        */
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
