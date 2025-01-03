import { USER_HISTORY } from "../base/constants";
import { DataMessage, DataUser } from "../base/interfaces";

export function getUserHistory(user:string):DataUser|null{
    try {
        return USER_HISTORY[user];
    } catch (error) {
        return null;
    }
}

export function saveUserHistory(messageData:DataMessage, commandName:string): DataUser|null{
    try {

        // Iniciarlizar variable "Step"
        let step = 0;
        
        // Validar que se envie el mismo comando que el anterior.
        if(USER_HISTORY[messageData.contact.id]?.commandName == commandName){

            // En caso de NO existir la propiedad "step", se le asigna 0.
            step = USER_HISTORY[messageData.contact.id]?.step ?? 0;
        }

        // Inicializar variable para mensajes enviados en un rango de tiempo.
        let messagesInRange = USER_HISTORY[messageData.contact.id]?.messagesInRange ?? 0;

        // Obtener la fecha del ultimo mensaje enviado.
        const timestamp = USER_HISTORY[messageData.contact.id]?.timestamp;
        
        // Calcular diferencia en segundos entre el ultimo mensaje enviado y el actual.
        if(timestamp && (timestamp - messageData.message.timestamp < 5)){
            messagesInRange++;
        }else{
            messagesInRange = 0;
        }

        // Informacion adicional la cual puede ser utilizada por algun comando.
        const extraInfo = USER_HISTORY[messageData.contact.id]?.extraInfo ?? null;

        // Asignar los nuevos datos.
        USER_HISTORY[messageData.contact.id] = {
            commandName,
            timestamp: messageData.message.timestamp,
            step,
            extraInfo,
            messagesInRange
        };

        return USER_HISTORY[messageData.contact.id];
    } catch (error) {
        return null
    }
}

export function isSpam(messageData:DataMessage){
    try {

        // Obtener historial de usuario.
        const userHistory = getUserHistory(messageData.contact.id);

        // Validar que existan datos.
        if(!userHistory){
            throw new Error("No tiene historial.");
        }

        // Validar que hayan menos de 5 mensajes en el rango de tiempo evaluado.
        if(userHistory.messagesInRange < 5){
            throw new Error("No tiene mensajes.");
        }

        // Obtener diferencia en segundos.
        const seconds = messageData.message.timestamp - userHistory.timestamp;

        // Validar que 
        if(seconds > 60){
            throw new Error("Han pasado mas de 60 segundos desde su ultimo mensaje.");
        }
        
        return true;
    } catch (error) {
        return false;
    }
}