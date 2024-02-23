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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
const constants = __importStar(require("../constants/constants.json"));
/**
 * Utility class containing methods for validation.
 */
class Utility {
    /**
     * Validates the existence of tables.
     * @param {string[]} tables - An array of table names to be validated.
     * @returns {boolean} Returns true if all tables exist, otherwise false.
     */
    static validateTables(tables) {
        let result = true;
        for (let i = 0; i < tables.length; i++) {
            let tableExists = constants.acquireLockConstants.validTables.includes(tables[i]);
            if (tableExists !== true) {
                result = false;
                return result;
            }
        }
        return result;
    }
    /**
     * Validates the application ID (Ricef).
     * @param {string} app_id - The application ID (Ricef) to be validated.
     * @returns {boolean} Returns true if the application ID is valid, otherwise false.
     */
    static validateApplication(app_id) {
        return constants.acquireLockConstants.validRicef.includes(app_id);
    }
}
exports.Utility = Utility;
