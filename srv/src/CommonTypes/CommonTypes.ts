/**
 * Interface representing the details of a lock.
 * @interface
 */
export interface LockDetails {
    /**
     * Indicates whether the resource is currently locked.
     */
    isLocked: boolean;
    
    /**
     * The application ID associated with the lock.
     */
    app_id: string;
    
    /**
     * The user who holds the lock.
     */
    user: string;
}

/**
 * Interface representing the keys associated with a table for locking purposes.
 * @interface
 */
export interface TableKeys {
    /**
     * An array of field names associated with the table.
     */
    fields: string[];
    
    /**
     * An array of table names.
     */
    tables: string[];
}

/**
 * Interface representing the response to a lock request.
 * @interface
 */
export interface LockResponse {
    /**
     * Indicates whether the lock request was successful.
     */
    isLocked: boolean;
    
    /**
     * A message providing additional information about the lock status.
     */
    message: string;
}

/**
 * Interface representing the response to an unlock request.
 * @interface
 */
export interface UnlockResponse {
    /**
     * Indicates whether the resource was successfully unlocked.
     */
    isLockReleased: boolean;
    
    /**
     * A message providing additional information about the unlock status.
     */
    message: string;
}

/**
 * Interface representing the result of checking the lock status.
 * @interface
 */
export interface CheckLock {
    /**
     * Indicates whether the resource is currently locked.
     */
    isLocked: boolean;
    
    /**
     * The application ID associated with the lock.
     */
    app_id: string;
    
    /**
     * The user who holds the lock.
     */
    user: string;
}
