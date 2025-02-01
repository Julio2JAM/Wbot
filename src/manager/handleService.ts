
import { ADMIN_USERS, ErrorMessageReply, MENSAJE_ESTADOS } from "../base/constants";
import { DataToResponse, FetchRequestData, MessageReply } from "../base/interfaces";
import { COMMANDS } from "../base/commands";
import { fetchRequest } from "./handleTask";
import { CEDULE_ERROR, CONSULT_EXTRUCTURE, CONSULT_FIRST_STEP, DEBT_INFORMATION, END_INFORMATION, INFORMATION_EXTRUCTURE, INFORMATION_FIRST_STEP, INFORMATION_SECOND_STEP, MAIN_MESSAGE, MAIN_MESSAGE_ADMIN, MY_INFORMATION, NOT_FOUND_USER, NOT_REGISTER, REMINDER, REPORT_EXTRUCTURE, REPORT_FINIST, REPORT_FIRST_STEP, REPORT_SECOND_STEP } from "../base/messages";
import { client } from "..";
// import { handleErrorMessage } from "../base/error";
import { getDate, getPathImg, sleep } from "../utils/helper";
import { handleErrorMessage, InvalidData } from "../base/error";
import { MessageMedia } from "whatsapp-web.js";

export function mainMessage(messageData:DataToResponse):MessageReply{
    try {

        // Validar que el usuario tenga permisos superiores.
        let message = ADMIN_USERS.includes(messageData.contact.id) 
        ? MAIN_MESSAGE_ADMIN 
        : MAIN_MESSAGE;

        // Respuesta.
        return {
            message,
            media: null
        }

    } catch (error) {
        return ErrorMessageReply;
    }
}

export function genericResponse(messageData:DataToResponse):MessageReply{
    try {

        // Obtener historial del Usuario.
        const command = COMMANDS[messageData.history.commandName];

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

export async function report(messageData:DataToResponse):Promise<MessageReply>{
    try {
        
        // Obtener historial del Usuario.
        const userHistory = messageData.history;

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
            const responseApi = await fetchRequest(fetchRequestData, String(messageData.contact.id));

            // Reemplaza los marcadores de posición en el mensaje
            const placeholders:any = {
                "[DATE]": `${date.date} ${date.time}`,
                "[ID]": messageData.contact.id,
                "[NOMBRE]": responseApi?.nombre || "Usuario no registrado.",
                "[MESSAGE]": `${messageData.message.body}`
            };

            // Enviar mensaje a grupo establecido.
            let message = REPORT_EXTRUCTURE;

            // Reemplaza los placeholders en el mensaje
            for (const [placeholder, value] of Object.entries(placeholders)) {
                message = message.replace(placeholder, value as string);
            }

            messageData.functions?.react("✍🏼");
            client?.sendMessage("120363374069939278@g.us", message);
            userHistory.step++;
            response.message = REPORT_FINIST;
        }

        // Respuesta.
        return response;

    } catch (error) {
        return handleErrorMessage(error, report.name, messageData.contact.id);
    }
}

export async function information(messageData:DataToResponse):Promise<MessageReply>{
    try {
        
        // Obtener historial del Usuario.
        const userHistory = messageData.history;

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
                "[NOMBRE]": response?.nombre || "Usuario no registrado.",
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

export async function promotion(messageData:DataToResponse):Promise<MessageReply>{
    try {
        
        const command = COMMANDS[messageData.history.commandName];

        // Aqui debe ir la validacion del mensaje del comando.
        if(!command.message){
            throw new Error("Ha ocurrido un error al obtener el mensaje de respuesta.");
        }

        // Datos para peticion fetch
        const fetchRequestData: FetchRequestData = {
            URL: "",
            method: "GET",
        };

        // Realizar peticion para realizar el pago.
        const responseApi = await fetchRequest(fetchRequestData, String(messageData.contact.id));
        
        if(!responseApi?.ruta){
            throw new InvalidData(command.message);
        }

        const imgPath = getPathImg(responseApi?.ruta);

        if(!imgPath){
            throw new Error("Ha ocurrido un error al obtener el mensaje de respuesta.");
        }

        const img = MessageMedia.fromFilePath(imgPath);

        // Respuesta.
        return {
            message: "",
            media: img
        }

    } catch (error) {
        return handleErrorMessage(error, promotion.name, messageData.contact.id);
    }
}

export async function myData(messageData:DataToResponse):Promise<MessageReply>{
    try {
        
        // Datos para peticion fetch
        const fetchRequestData: FetchRequestData = {
            URL: `http://localhost/control_de_pago_remake/public/api/cheems_client/0${messageData.contact.number}`,
            method: "GET",
        };

        // Realizar peticion para obtener datos del usuario.
        const response = await fetchRequest(fetchRequestData, String(messageData.contact.id));

        // En caso de no obtener informacion del usuario, se envia un mensaje diferente.
        if(!response || response.length == 0){
            throw new InvalidData(NOT_REGISTER);
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
            message = message.replace(placeholder, `${value}`);
        }

        return {
            message,
            media: null
        }

    } catch (error) {
        return handleErrorMessage(error, myData.name, messageData.contact.id);
    }
}

export async function consult(messageData:DataToResponse):Promise<MessageReply>{
    try {

        // Respuesta.
        const response = {
            message: CONSULT_FIRST_STEP,
            media: null
        }

        // Validar que el usuario NO haya enviado la cedula (paso 1)
        if(messageData.history.step == 0){
            messageData.history.step++;
        }else{

            // Datos para peticion fetch
            const fetchRequestData: FetchRequestData = {
                URL: `http://localhost/control_de_pago_remake/public/api/cheems_client/0${Number(messageData.message.body)}`,
                method: "GET",
            };

            // Realizar peticion para obtener datos del usuario.
            const fetchResponse = await fetchRequest(fetchRequestData, String(messageData.contact.id));

            // Validar que se haya obtenido respuesta.
            if(!fetchResponse || fetchResponse.length == 0){
                throw new InvalidData(NOT_FOUND_USER);
            }

            // Inicializa el mensaje con la información básica
            let message = CONSULT_EXTRUCTURE;
            
            // Reemplaza los marcadores de posición en el mensaje
            const placeholders:any = {
                "[NOMBRE]": fetchResponse.nombre,
                "[CORTE]": fetchResponse.corte,
                "[ESTADO]": fetchResponse.estado,
                "[PLAN]": fetchResponse.plan,
                "[DEUDA]": fetchResponse.deuda,
                "[MOTIVO_DEUDA]": fetchResponse.motivo_deuda ?? "N/A"
            };

            // Reemplaza los placeholders en el mensaje
            for (const [placeholder, value] of Object.entries(placeholders)) {
                message = message.replace(placeholder, value as string);
            }

            response.message = message;
            messageData.history.step++;
        }

        return response;

    } catch (error) {
        return handleErrorMessage(error, consult.name, messageData.contact.id);
    }
}

export async function reminder(messageData:DataToResponse):Promise<MessageReply>{
    try {

        // Datos para peticion fetch
        const fetchRequestDataUsers: FetchRequestData = {
            URL: `http://localhost/control_de_pago_remake/public/api/cheems_clients`,
            method: "GET",
        };
        
        // Realizar peticion para realizar el pago.
        const users = await fetchRequest(fetchRequestDataUsers, String(messageData.contact.id));

        // Validar que se hayan obtenidos usuarios para notificar.
        if(!users){
            throw new Error("No se han obtenido usuarios.");
        }

        const response = {
            success: [] as String[],
            failed: [] as String[],
        }

        // Iterar usuarios.
        for (const key in users) {

            const value = users[key];

            // De no existir la propiedad telefono, se omite el resto de la iteraccion.
            if(!value.tlf){
                response.failed.push(value.telefono);
                continue;
            }

            // Obtener id en WhatsApp del numero.
            const contact = await client?.getNumberId(`58${Number(value.tlf)}`);
            
            // Validar en caso que el numero no tenga WhatsApp
            if(!contact){
                response.failed.push(value.tlf);
                continue;
            }

            response.success.push(value.tlf);

            // Inicializa el mensaje con la información básica
            let message = REMINDER;
            
            // Reemplaza los marcadores de posición en el mensaje
            const placeholders:any = {
                "[NOMBRE]": value.nombre,
                "[ESTADO]": MENSAJE_ESTADOS[value.estado_id],
                "[PLAN]": value.plan,
            };

            // Reemplaza los placeholders en el mensaje
            for (const [placeholder, value] of Object.entries(placeholders)) {
                message = message.replace(placeholder, value as string);
            }

            // Enviar mensaje.
            await client?.sendMessage(contact._serialized, message);

            // Esperar 5s
            await sleep(5000);

            // Cada 10 mensajes hacer una pausa mas larga
            if(Number(key) > 0 && Number(key) % 5 == 0){
                await sleep(180000);
            }
            
        }

        // Respuesta.
        return {
            message: "Recordatorio finalizado, mensajes enviados: "+response.success.length+", mensajes fallidos: "+(response.failed.length > 0  ? response.failed : "0"),
            media: null
        }

    } catch (error) {
        return handleErrorMessage(error, reminder.name, messageData.contact.id);
    }
}
