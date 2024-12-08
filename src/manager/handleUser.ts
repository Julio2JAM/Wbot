import { USER_HISTORY } from "..";
import { DataMessage, DataUser } from "../base/interfaces";

export function getUserHistory(user:string):DataUser|null{
    try {
        return USER_HISTORY[user];
    } catch (error) {
        return null;
    }
}

export function saveUserHistory(messageData:DataMessage, commandName:string){
    try {

        let step = USER_HISTORY[messageData.contact.id]?.step ?? 1;

        if(commandName == USER_HISTORY[messageData.contact.id]?.commandName){
            step++;
        }

        USER_HISTORY[messageData.contact.id] = {
            commandName,
            timestamp: messageData.message.timestamp,
            step,
        };

    } catch (error) {
        console.log(error);
    }
}