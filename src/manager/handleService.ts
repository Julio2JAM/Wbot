
import { ErrorMessageReply } from "../base/constants";
import { DataMessage, MessageReply } from "../base/interfaces";
import { COMMANDS } from "../base/commands";
import { getUserHistory } from "./handleTask";
import { REPORT_FINIST, REPORT_FIRST_STEP, REPORT_SECOND_STEP } from "../base/messages";

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

        // Respuesta.
        const response = {
            message: REPORT_FIRST_STEP,
            media: null
        }

        // Validar que el usuario NO haya enviado la cedula (paso 1)
        if(userHistory.step == 0){
            
            // Obtener todos los numeros del mensaje enviado.
            const cedula = messageData.message.body.match(/\d+/g);

            // Evaluar que se haya obtenido la cedula y que su longitud sea mayor a 5 digitos.
            if(cedula && cedula.length > 5){
                userHistory.step++;
                userHistory.extraInfo = cedula;
            }
            
        // Validar que el usuario haya enviado la cedula (paso 2)
        }else if(userHistory.step == 1){
            userHistory.step++;
            response.message = REPORT_SECOND_STEP;

        // Validar que se haya enviado el problema, para enviar el ultimo mensaje (paso 3)
        }else{

            // Datos para peticion fetch
            /*
            const fetchRequestData: FetchRequestData = {
                URL: ,
                method: "GET",
            };
            */

            userHistory.step++;
            response.message = REPORT_FINIST;
        }

        // Respuesta.
        return response;

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
