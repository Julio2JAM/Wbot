import { Request } from "express";
import { BadRequest, handleError, InternalError } from "../base/error";
import { ErrorResponse, SuccessResponse } from "../base/interfaces";
import { HTTP_STATUS } from "../base/constants";
import { client } from "..";
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

    async difusion(req: Request):Promise<SuccessResponse|ErrorResponse>{
        try {

            // Validar que el cliente de WhatsApp este iniciado.
            if(!client){
                throw new InternalError("El cliente de WhatsApp no esta iniciado.");
            }

            // Validar que se hayan obtenidos usuarios para notificar.
            if(!req.body?.usuarios){
                throw new Error("No se han obtenido usuarios.");
            }
            
            // Validar que se hayan obtenidos usuarios para notificar.
            if(!req.body?.mensaje){
                throw new Error("No se han obtenido el mensaje.");
            }

            const users = req.body.usuarios;

            const response = {
                success: [] as String[],
                failed: [] as String[],
            }

            // Iterar usuarios.
            for (const [key, value] of users.entries()) {

                // De no existir la propiedad telefono, se omite el resto de la iteraccion.
                if(!value.tlf){
                    response.failed.push(value.tlf);
                    continue;
                }

                // Obtener id en WhatsApp del numero.
                const contact = await client.getNumberId(`58${Number(value.tlf)}`);
                
                // Validar en caso que el numero no tenga WhatsApp
                if(!contact){
                    response.failed.push(value.tlf);
                    continue;
                }

                response.success.push(value.tlf);

                // Enviar mensaje.
                await client.sendMessage(contact._serialized, req.body.mensaje);
                
                /*console.log({
                    "Usuario":value.tlf,
                    "Mensaje":req.body.mensaje
                });*/

                // Esperar s
                await sleep(3000);

                // Cada 10 mensajes hacer una pausa mas larga
                if((key+1) % 20 == 0){
                    await sleep(60000);
                }

            }

            return {status: HTTP_STATUS.OK, response};

        } catch (error) {
            return handleError(error);
        }
    }

}