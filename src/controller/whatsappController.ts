import { Request } from "express";
import { BadRequest, handleError, InternalError } from "../base/error";
import { ErrorResponse, FetchRequestData, SuccessResponse } from "../base/interfaces";
import { HTTP_STATUS, ME } from "../base/constants";
import { client } from "..";
import { fetchRequest } from "../manager/handleTask";
import { sleep } from "../utils/helper";

export class whatsappController {

    async get(_req: Request):Promise<SuccessResponse|ErrorResponse>{

        try {

            // Validar que el bot este inicializado.
            if(!client){
                throw new InternalError("El cliente de WhatsApp no esta iniciado.");
            }

            // Obtener chats.
            const chats = await client.getChats();

            // Retornar respuesta.
            return {status: HTTP_STATUS.OK, response:chats};

        } catch (error) {
            return handleError(error);
        }

    }

    async post(req: Request):Promise<SuccessResponse|ErrorResponse>{
        try {
            const { to, message } = req.body;

            if (!to || !message) {
                throw new BadRequest("Datos invalidos.");
            }

            if(!client){
                throw new InternalError("El cliente de WhatsApp no esta iniciado.");
            }

            const contact = await client.getNumberId(to);
            
            if(!contact){
                throw new InternalError("El cliente de WhatsApp no esta iniciado.");
            }

            await client.sendMessage(contact._serialized, message);
            
            return {status: HTTP_STATUS.OK, response:{ message: "Message sent successfully" }};

        } catch (error) {
            return handleError(error);
        }
    }

    async reminder(_req: Request):Promise<SuccessResponse|ErrorResponse>{
        try {

            /*
            // Obtener fecha y dia actual.
            const dateData = getDate();

            // Validar que ya se hayan enviado los mensajes de hoy.
            if(REMINDER_DATETIME == dateData.date){
                throw new InternalError("Recordatorios ya enviado.");
            }
            
            // Datos para peticion fetch de la programacion de los envios.
            const fetchRequestDataDate: FetchRequestData = {
                URL: "",
                method: "GET",
            };
            
            // Realizar peticion para realizar el pago.
            const dateBD = await fetchRequest(fetchRequestDataDate, ME);

            // Aqui debe ir la validacion de los datos obtenidos

            // Despues la hora actual y despues 

            // Asignar fecha actual.
            REMINDER_DATETIME = dateData.date;

            */

            // Validar que el cliente de WhatsApp este iniciado.
            if(!client){
                throw new InternalError("El cliente de WhatsApp no esta iniciado.");
            }

            // Datos para peticion fetch
            const fetchRequestDataUsers: FetchRequestData = {
                URL: "",
                method: "GET",
            };
            
            // Realizar peticion para realizar el pago.
            const users = await fetchRequest(fetchRequestDataUsers, ME);

            // Validar que se hayan obtenidos usuarios para notificar.
            if(!users){
                throw new Error("No se han obtenido usuarios.");
            }

            const response = {
                success: [] as String[],
                failed: [] as String[],
            }

            // Iterar usuarios.
            for (const [key, value] of users.entries()) {

                // De no existir la propiedad telefono, se omite el resto de la iteraccion.
                if(!value.telefono){
                    response.failed.push(value.telefono);
                    continue;
                }

                // Obtener id en WhatsApp del numero.
                const contact = await client.getNumberId(value.telefono);
                
                // Validar en caso que el numero no tenga WhatsApp
                if(!contact){
                    response.failed.push(value.telefono);
                    continue;
                }

                response.success.push(value.telefono);

                // Enviar mensaje.
                await client.sendMessage(contact._serialized, "message");

                // Esperar 1s
                sleep(1000);

                // Cada 10 mensajes hacer una pausa mas larga
                if(key % 10 == 0){
                    sleep(100000);
                }
                
            }

            return {status: HTTP_STATUS.OK, response:{ message: "Message sent successfully" }};

        } catch (error) {
            return handleError(error);
        }
    }

}