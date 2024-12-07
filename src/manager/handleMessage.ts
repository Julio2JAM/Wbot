import { Message } from "whatsapp-web.js";
import { extractCountryCode } from "../utils/helper";
import { DataMessage } from "../base/interfaces";

/**
 * Esta función recibe un mensaje y devuelve un objeto DataMessage.
 * @param message El mensaje que se va a procesar.
 * @returns {DataMessage} Un objeto DataMessage con información detallada del mensaje.
 */
export async function getDataMessage(message: Message):Promise<DataMessage|null>{
    try {
        // Obtiene el contacto del mensaje
        const contact = await message.getContact();

        // Obtiene el código de país del contacto si no es un grupo
        const countryCode = !contact.isGroup ? extractCountryCode(contact.number) : null;

        // Obtiene el número del contacto sin el código de país
        const number = contact.number.substring(countryCode?.length ?? 0);

        // Obtiene el mensaje al que se respondió, si existe
        const repliedMessage = await message.getQuotedMessage();

        // Obtiene el chat del mensaje
        const chat = await message.getChat();

        // Devuelve un objeto con información detallada del contacto, el chat y el mensaje
        return {
            contact: {
                id: contact.id.user,
                number: number,
                name: contact.name || contact.pushname || null,
                isGroup: contact.isGroup,
                countryCode: countryCode,
            },
            chat: {
                unreadCount: chat.unreadCount,
                archived: chat.archived,
            },
            message: {
                id: message.id.id,
                type: message.type,
                body: message.body,
                fromMe: message.fromMe,
                timestamp: message.timestamp,
                isStatus: message.isStatus,
                idReplied: repliedMessage ? repliedMessage.id.id : null,
            },
        }   
    } catch (error) {
        console.error("No se pudo convertir la data.", error);
        return null;
    }
}
