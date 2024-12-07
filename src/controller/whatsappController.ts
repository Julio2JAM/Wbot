import { Request } from "express";
import { BadRequest, handleError, InternalError } from "../base/error";
import { ErrorResponse, SuccessResponse } from "../base/interfaces";
import { HTTP_STATUS } from "../base/constants";
import { client } from "..";

export class whatsappController {

    async get(_req: Request):Promise<SuccessResponse|ErrorResponse>{

        try {

            return {status: HTTP_STATUS.OK, response:{}/*chats*/}
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

}