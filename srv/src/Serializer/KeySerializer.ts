import { TableKeys } from "../CommonTypes/CommonTypes";


export class KeySerializer{

    public static serialize(key:TableKeys){
        return JSON.stringify(key);
    }
}