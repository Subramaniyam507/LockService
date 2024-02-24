import { TableKeys } from "../CommonTypes/CommonTypes";


export class KeySerializer {
  
    public static serialize(key: TableKeys): string {
        return JSON.stringify(key);
    }
}
