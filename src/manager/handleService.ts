
import { ErrorMessageReply } from "../base/constants";
import { DataMessage, MessageReply } from "../base/interfaces";
import { COMMANDS } from "../base/commands";
import { getUserHistory } from "./handleTask";
import { CEDULE_ERROR, REPORT_FINIST, REPORT_FIRST_STEP, REPORT_SECOND_STEP } from "../base/messages";
import { client } from "..";

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

            userHistory.step++;
            
        // Validar que el usuario haya enviado la cedula (paso 2)
        }else if(userHistory.step == 1){
            
            // Obtener todos los numeros del mensaje enviado.
            let cedula: RegExpMatchArray | null | string = messageData.message.body.match(/\d+/g);

            // Concatenarlos, por si fueron enviados separados por puntos.
            cedula = cedula?.join('') ?? null;

            // Evaluar que se haya obtenido la cedula y que su longitud sea mayor a 5 digitos.
            if(cedula && cedula.length > 5){
                response.message = REPORT_SECOND_STEP;
                userHistory.step++;
                userHistory.extraInfo = cedula;
            }else{
                response.message = CEDULE_ERROR;
            }

        // Validar que se haya enviado el problema, para enviar el ultimo mensaje (paso 3)
        }else{

            // Datos para peticion fetch
            /*
            const fetchRequestData: FetchRequestData = {
                URL: ,
                method: "GET",
            };
            const user = "";
            */

            const message = `Nuevo reporte:\n\nNumero que reporta: ${messageData.contact.number}\n\nUsuario del inconveniente: ${userHistory.extraInfo}\n\nMensaje: ${messageData.message.body}`;
            client?.sendMessage("120363374069939278@g.us", message);
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
