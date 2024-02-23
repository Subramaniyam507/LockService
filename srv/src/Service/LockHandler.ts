import { CheckLock, LockDetails, LockResponse, TableKeys, UnlockResponse } from "../CommonTypes/CommonTypes";
import { container } from "../Cache/ContainerConfig";
import { TableLockHashMap } from "../Cache/LockMap";
import { Utility } from '../Utility/Utiltity';
import * as constants from '../constants/constants.json';

export class TableLockilandLerService {

    constructor() {
        // Constructor logic if needed
    }

    public async acquireLock(req: any): Promise<LockResponse> {
        const tables = req.data.request.tables;

        if (!Utility.validateTables(tables)) {
            req.reject(480, constants.acquireLockConstants.invalidTableMessage);
        }

        if (!Utility.validateApplication(req.data.request.ricef)) {
            req.reject(489, constants.acquireLockConstants.invalidApplication);
        }

        const resp = this.grantLock(req);
        return resp;
    }

    private grantLock(req: any): LockResponse {
        const tableLockHashMap = container.get<TableLockHashMap>('cacheLockMap');
        const key: TableKeys = {
            fields: req.data.request.fields.sort(),
            tables: req.data.request.tables.sort()
        };
    
        if (tableLockHashMap.hasKey(key)) {
            const lockDetails: LockDetails | undefined = tableLockHashMap.get(key);
    
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
            else{
            const value: LockDetails = {
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
    else{
        const value: LockDetails = {
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
    private prepareLockResponse(isLocked: boolean, message: string): LockResponse {
        const response: LockResponse = {
            isLocked: isLocked,
            message: message
        };
        return response;
    }
    
    private prepareUnlockResponse(isLockReleased: boolean, message: string): UnlockResponse {
        const response: UnlockResponse = {
            isLockReleased: isLockReleased,
            message: message
        };
        return response;
    }
    public async checkLock(record: TableKeys): Promise<LockDetails> {
        const tableLockHashMap = container.get<TableLockHashMap>('cacheLockMap');
    
        let lockDetails: LockDetails;
        let key: TableKeys = {
            fields: record.fields.sort(),
            tables: record.tables.sort()
        };
    
        if (tableLockHashMap.hasKey(key)) {
            lockDetails = tableLockHashMap.get(key) as LockDetails;
            return lockDetails;
        } else {
            lockDetails = {
                isLocked: false,
                app_id: "",
                user: ""
            };
            return lockDetails;
        }
    }
   
    private setTimeouts(key:TableKeys){
        const tableLockHashMap = container.get<TableLockHashMap>('cacheLockMap');

        setTimeout(()=>{
            tableLockHashMap.delete(key);
        },constants.acquireLockConstants.timeouts.keyTimeout);

        setTimeout(()=>{
            if(tableLockHashMap.hasKey(key)){
                const lockDetails:LockDetails|undefined = tableLockHashMap.get(key);
                if(lockDetails){
                    lockDetails.isLocked = false;
                    lockDetails.user = "";
                    lockDetails.app_id = "";
                    tableLockHashMap.set(key,lockDetails);
                }

            }
        },constants.acquireLockConstants.timeouts.lockTimeout);
    }

}
