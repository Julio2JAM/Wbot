import { Request } from "express";
import { handleError } from "../base/error";
import { ErrorResponse, SuccessResponse } from "../base/interfaces";
import { HTTP_STATUS } from "../base/constants";

export class whatsappController {

    async get(_req: Request):Promise<SuccessResponse|ErrorResponse>{

        try {

            return {status: HTTP_STATUS.OK, response:{}/*chats*/}
        } catch (error) {
            return handleError(error);
        }

    }

    /*
    async post(req: Request, res: Response): Promise<Response> {

        try {

            const { to, message } = req.body;

            if (!to || !message) {
                throw new Errors.BadRequest("Invalid data");
            }

            const chatsData = await getDataChats();

            if (!to || !message) {
                throw new Errors.BadRequest("Invalid data");
            }

            await client.sendMessage(chat.contact._serialized, message);
            return res.status(HTTP_STATUS.CREATED).json({ message: "Message sent successfully" });

        } catch (error) {
            return handleError(error, res);
        }

    }
    */

}