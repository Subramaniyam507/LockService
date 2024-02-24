
export interface LockDetails {
 
    isLocked: boolean;
    app_id: string;
    user: string;
}


export interface TableKeys {
 
    fields: string[]; 
    tables: string[];
}


export interface LockResponse {
   
    isLocked: boolean;
    
 
    message: string;
}


export interface UnlockResponse {
 
    isLockReleased: boolean;
    
 
    message: string;
}


export interface CheckLock {
  
    isLocked: boolean;
 
    app_id: string;
    
    user: string;
}
