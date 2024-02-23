type RequestLockAndUnLock {
    fields: array of String;
    tables: array of String;
    user: String;
    ricef: String;
}

type LockResponse {
    isLocked: Boolean;
    message: String;
}

type UnlockResponse {
    isLockReleased: Boolean;
    message: String;
}

type TableKeys {
    fields: array of String;
    tables: array of String;
}

type CheckLock {
    isLocked: Boolean;
    ricef: String;
    user: String;
}
