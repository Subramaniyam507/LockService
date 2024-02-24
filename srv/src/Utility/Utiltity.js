"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utility = void 0;
const constants = require("../constants/constants.json");
class Utility {
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
    static validateApplication(app_id) {
        return constants.acquireLockConstants.validRicef.includes(app_id);
    }
}
exports.Utility = Utility;
