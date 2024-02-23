import * as constants from '../constants/constants.json';

export class Utility {

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

    public static validateApplication(app_id:string): boolean {
        return constants.acquireLockConstants.validRicef.includes(app_id);
    }
}
