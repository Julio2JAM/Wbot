
import { ErrorMessageReply } from "../base/constants";
import { DataMessage, MessageReply } from "../base/interfaces";
import { COMMANDS } from "../base/commands";
import { getUserHistory } from "./handleUser";
import { REPORT_FIRST_STEP } from "../base/messages";

export function genericResponse(messageData:DataMessage):MessageReply{
    try {

        // Obtener historial del Usuario.
        const userHistory = getUserHistory(messageData.contact.id);

        // Validar que los datos se hayan registrado bien.
        if(!userHistory){
            throw new Error("Comando no encontrado.");
        }

        const command = COMMANDS[userHistory.commandName];

        // Aqui debe ir la validacion del mensaje del comando.
        if(!command.message){
            throw new Error("Ha ocurrido un error al obtener el mensaje de respuesta.");
        }

        // Respuesta.
        return {
            message: command.message,
            media: null
        }

    } catch (error) {
        return ErrorMessageReply;
    }
}

export function report(messageData:DataMessage):MessageReply{
    try {
        
        // Obtener historial del Usuario.
        const userHistory = getUserHistory(messageData.contact.id);

        // Validar que los datos se hayan registrado bien.
        if(!userHistory){
            throw new Error("Comando no encontrado.");
        }

        if(userHistory.step){

        }

        return {
            message: REPORT_FIRST_STEP,
            media: null
        }
    } catch (error) {
        return ErrorMessageReply;
    }
}

export function myData(messageData:DataMessage):MessageReply{
    try {
        console.log(messageData);
        return {
            message: REPORT_FIRST_STEP,
            media: null
        }
    } catch (error) {
        return ErrorMessageReply;
    }
}
