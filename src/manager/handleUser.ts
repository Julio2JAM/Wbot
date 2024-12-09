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

        // Iniciarlizar variable "Step"
        let step = 0;
        
        // Validar que se envie el mismo comando que el anterior.
        if(USER_HISTORY[messageData.contact.id]?.commandName == commandName){

            // En caso de NO existir la propiedad "step", se le asigna 0.
            step = USER_HISTORY[messageData.contact.id]?.step ?? 0;
        }

        // Asignar los nuevos datos.
        USER_HISTORY[messageData.contact.id] = {
            commandName,
            timestamp: messageData.message.timestamp,
            step
        };

    } catch (error) {
        console.log(error);
    }
}