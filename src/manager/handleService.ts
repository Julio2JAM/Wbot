
import { ErrorMessageReply } from "../base/constants";
import { DataMessage, FetchRequestData, MessageReply } from "../base/interfaces";
import { COMMANDS } from "../base/commands";
import { fetchRequest } from "./handleTask";
import { CEDULE_ERROR, DEBT_INFORMATION, END_INFORMATION, INFORMATION_EXTRUCTURE, INFORMATION_FIRST_STEP, INFORMATION_SECOND_STEP, MY_INFORMATION, REPORT_FINIST, REPORT_FIRST_STEP, REPORT_SECOND_STEP } from "../base/messages";
import { client } from "..";
// import { handleErrorMessage } from "../base/error";
import { getDate } from "../utils/helper";
import { getUserHistory } from "./handleUser";

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

export async function report(messageData:DataMessage):Promise<MessageReply>{
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
            const fetchRequestData: FetchRequestData = {
                URL: `http://localhost/control_de_pago_remake/public/api/cheems_client/0${messageData.contact.number}`,
                method: "GET",
            };

            const date = getDate();

            // Realizar peticion para obtener datos del usuario.
            const response = await fetchRequest(fetchRequestData, String(messageData.contact.id));

            // Reemplaza los marcadores de posición en el mensaje
            const placeholders:any = {
                "[DATE]": `${date.date} ${date.time}`,
                "[ID]": messageData.contact.id,
                "[NOMBRE]": response.nombre || "Usuario no registrado.",
                "[MESSAGE]": `"${messageData.message.body}"`
            };

            // Enviar mensaje a grupo establecido.
            let message = INFORMATION_EXTRUCTURE;

            // Reemplaza los placeholders en el mensaje
            for (const [placeholder, value] of Object.entries(placeholders)) {
                message = message.replace(placeholder, value as string);
            }

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

export async function information(messageData:DataMessage):Promise<MessageReply>{
    try {
        
        // Obtener historial del Usuario.
        const userHistory = getUserHistory(messageData.contact.id);

        // Validar que los datos se hayan registrado bien.
        if(!userHistory){
            throw new Error("Comando no encontrado.");
        }

        // Respuesta.
        const response = {
            message: INFORMATION_FIRST_STEP,
            media: null
        }

        // Validar que el usuario NO haya la solicitud de informacion.
        if(userHistory.step == 0){

            // Avanzar al paso siguiente.
            userHistory.step++;
            
        // Mensaje de espera, mientras alguien atiende la solicitud
        }else if(userHistory.step == 1){
            
            // Datos para peticion fetch
            const fetchRequestData: FetchRequestData = {
                URL: `http://localhost/control_de_pago_remake/public/api/cheems_client/0${messageData.contact.number}`,
                method: "GET",
            };

            const date = getDate();

            // Realizar peticion para obtener datos del usuario.
            const response = await fetchRequest(fetchRequestData, String(messageData.contact.id));

            // Reemplaza los marcadores de posición en el mensaje
            const placeholders:any = {
                "[DATE]": `${date.date} ${date.time}`,
                "[ID]": messageData.contact.id,
                "[NOMBRE]": response.nombre || "Usuario no registrado.",
                "[MESSAGE]": `"${messageData.message.body}"`
            };

            // Enviar mensaje a grupo establecido.
            let message = INFORMATION_EXTRUCTURE;

            // Reemplaza los placeholders en el mensaje
            for (const [placeholder, value] of Object.entries(placeholders)) {
                message = message.replace(placeholder, value as string);
            }

            client?.sendMessage("120363374069939278@g.us", message);
            
            // Mensaje de espera
            response.message = INFORMATION_SECOND_STEP;

            // Avanzar al paso siguiente.
            userHistory.step++;
        }

        // Respuesta.
        return response;

    } catch (error) {
        return ErrorMessageReply;
    }
}

export function promotion(messageData:DataMessage):MessageReply{
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

        // Datos para peticion fetch
        /*
        const fetchRequestData: FetchRequestData = {
            URL: ,
            method: "GET",
        };
        // Realizar peticion para realizar el pago.
        const response = await fetchRequest(fetchRequestData, String(idUser));
        const user = "";
        
        const imgPath = getPathImg();
        const img = MessageMedia.fromFilePath(imgPath);
        */

        // Respuesta.
        return {
            message: command.message,
            media: null
        }

    } catch (error) {
        return ErrorMessageReply;
    }
}

export async function myData(messageData:DataMessage):Promise<MessageReply>{
    try {
        
        // Datos para peticion fetch
        const fetchRequestData: FetchRequestData = {
            URL: `http://localhost/control_de_pago_remake/public/api/cheems_client/0${messageData.contact.number}`,
            method: "GET",
        };

        // Realizar peticion para obtener datos del usuario.
        const response = await fetchRequest(fetchRequestData, String(messageData.contact.id));

        //TODO: Aqui debe ir un mensaje de que el usuario no esta en la plataforma.
        if(!response){
            throw new Error("No se ha podido obtener los datos.");
        }

        // Inicializa el mensaje con la información básica
        let message = MY_INFORMATION;

        // Reemplaza los marcadores de posición en el mensaje
        const placeholders:any = {
            "[NOMBRE]": response.nombre,
            "[CORTE]": response.corte,
            "[ESTADO]": response.estado,
            "[PLAN]": response.plan
        };

        // Si hay deuda, añade la información de deuda al mensaje
        if (response.deuda && response.motivo_deuda) {
            message += DEBT_INFORMATION;

            placeholders["[DEUDA]"] = response.deuda;
            placeholders["[MOTIVO_DEUDA]"] = response.motivo_deuda;
        }

        // Agregar la información final al mensaje
        message += END_INFORMATION;

        // Reemplaza los placeholders en el mensaje
        for (const [placeholder, value] of Object.entries(placeholders)) {
            message = message.replace(placeholder, value as string);
        }


        return {
            message,
            media: null
        }

    } catch (error) {
        // return handleErrorMessage(error, "myData", );
        return ErrorMessageReply;
    }
}
