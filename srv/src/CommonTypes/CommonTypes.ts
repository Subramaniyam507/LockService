
// Interface for LockDetails
export interface LockDetails {
    isLocked: Boolean;
    app_id: String;
    user: String;
}

// Interface for TableKeys
export interface TableKeys {
    fields: String[];
    tables: String[];
}

// Interface for LockResponse
export interface LockResponse {
    isLocked: Boolean;
    message: String;
}

// Interface for UnlockResponse
export interface UnlockResponse {
    isLockReleased: Boolean;
    message: String;
}

// Interface for CheckLock
export interface CheckLock {
    isLocked: Boolean;
    app_id: String;
    user: String;
}