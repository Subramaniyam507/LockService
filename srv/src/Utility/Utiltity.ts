import * as constants from '../constants/constants.json';

/**
 * Utility class containing methods for validation.
 */
export class Utility {

    /**
     * Validates the existence of tables.
     * @param {string[]} tables - An array of table names to be validated.
     * @returns {boolean} Returns true if all tables exist, otherwise false.
     */
    public static validateTables(tables: string[]): boolean {
        let result: boolean = true;

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
    public static validateApplication(app_id: string): boolean {
        return constants.acquireLockConstants.validRicef.includes(app_id);
    }
}
