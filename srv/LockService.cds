using {CheckLock,LockResponse,TableKeys,RequestLockAndUnLock,UnlockResponse} from '../db/dataTransferTypes';
service DistributedCacheService {

    action acquireLock(request: RequestLockAndUnLock) returns LockResponse;

    action releaseLock(request: RequestLockAndUnLock) returns UnlockResponse;

    action checkLock(keyfields: TableKeys) returns CheckLock;

    action clearCache(keyfields: TableKeys) returns String;

    function viewLockCache() returns array of String;

    function viewTimeouts() returns array of String;

}
