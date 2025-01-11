import { Chat, Message } from "whatsapp-web.js";
import { extractCountryCode, sleep } from "../utils/helper";
import { DataMessage, DataToResponse } from "../base/interfaces";
import { getUserHistory, isSpam, saveUserHistory } from "./handleUser";
import { ADMIN_COMMANDS, COMMANDS } from "../base/commands";
import { ADMIN_USERS } from "../base/constants";
import { handleErrorMessage, InvalidData } from "../base/error";
import { SPAM_MESSAGE } from "../base/messages";

/**
 * Esta función recibe un mensaje y devuelve un objeto DataMessage.
 * @param message El mensaje que se va a procesar.
 * @returns {DataMessage} Un objeto DataMessage con información detallada del mensaje.
 */
export async function getDataMessage(message: Message, chat:Chat, internal = true):Promise<DataMessage|null>{
    try {
        // Obtiene el contacto del mensaje
        const contact = await message.getContact();

        // Obtiene el código de país del contacto si no es un grupo
        const countryCode = !contact.isGroup ? extractCountryCode(contact.number) : null;

        // Obtiene el número del contacto sin el código de país
        const number = contact.number.substring(countryCode?.length ?? 0);

        // Obtiene el mensaje al que se respondió, si existe
        const repliedMessage = await message.getQuotedMessage();

        // Devuelve un objeto con información detallada del contacto, el chat y el mensaje
        const dataMessage:DataMessage = {
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

        // Validar si la funcion fue utilizada internamente.
        if(internal){
            // Funciones para uso interno.
            dataMessage.functions = {
                react: message.react,
                reply: message.reply,
            };
        }

        return dataMessage;
    } catch (error) {
        console.error("No se pudo convertir la data.", error);
        return null;
    }
}

export async function getResponse(messageData:DataMessage) {
    try {

        // Obtener comando segun la interaccion del usuario.
        const commandName = getCommandName(messageData.contact.id, messageData.message.body);

        // Guardar nueva interaccion.
        const history = saveUserHistory(messageData, commandName);

        // Validar que la interaccion del usuario se haya guardado exitosamente.
        if(!history){throw new Error("Error al guardar la informacion del usuario.");}

        // Validar que la ultima interaccion no cumpla los criterios de spam.
        if(isSpam(messageData)){throw new InvalidData(SPAM_MESSAGE);}

        // Almacenar historial del usuario en la variable {}
        const dataToResponse = { ...messageData, history } as DataToResponse;

        // Obtener de la accion que ejecuta el comando, el mensaje para responder.
        const response = COMMANDS[commandName].action(dataToResponse);

        return response;
    } catch (error) {
        return handleErrorMessage(error, getResponse.name, messageData.contact.id);
    }
}

/**
 * Funcion para validar y obtener el comando con el que puede interacturar un usuario segun su mensaje enviado.
 * @param {string} idUser Usuario que escribe al bot, se utiliza para manejar informacion relacionada a los permisos
 * @param {string} messageContent Contenido del mensaje que envia el usuario
 * @returns {string} Comando para interaccion del usuario.
 */
export function getCommandName(idUser:string, messageContent:string):string {
    try {

        // Obtener historial del Usuario.
        const userHistory = getUserHistory(idUser);

        // Validar que el usuario haya interactuado antes con el bot.
        if(!userHistory){
            throw new Error("El usuario no tiene un registro previo.");
        }

        // Validar que el comando registrado en el historial de interaccion se encuentre.
        if(!COMMANDS[userHistory.commandName]){
            throw new Error("Comando no encontrado.");
        }

        // Variable para el comando en el historial.
        let findedCommand = COMMANDS[userHistory.commandName];

        // Validar que el comando tenga subcomandos.
        if(!findedCommand.subcommands){
            throw new Error("El comando no tiene subcomandos.");
        }

        // Almacenar el nombre del comando del historial, en caso de que se envia una opcion invalida.
        let commandName = userHistory.commandName;

        if(userHistory.step > COMMANDS[commandName].steps){
            throw new Error("El usuario ya paso todos los pasos del comando.");
        }

        // En caso de que la opcion sea valida, se remplaza el comando de respuesta.
        if(findedCommand.subcommands[messageContent]){
            commandName = findedCommand.subcommands[messageContent];
        }

        // Validar comando consultado.
        if(ADMIN_COMMANDS.includes(commandName) && !ADMIN_USERS.includes(idUser)){
            throw new Error("El usuario no tiene acceso a este comando.");
        }

        return commandName;
    } catch (error) {
        console.log(error);
        return "INICIO";
    }
}

/**
 * Esta función prepara el chat para enviar una respuesta.
 * Simula el comportamiento humano de leer y responder a un mensaje.
 * @param message El mensaje que se va a responder.
 */
export const getReadyToResponse = async (chat: Chat) => {
    try {
        // Espera 500 milisegundos para simular el tiempo de lectura
        await sleep(500);

        // Marca el mensaje como leído en el chat
        await chat.sendSeen();

        // Espera otros 500 milisegundos para simular el tiempo de reflexión
        await sleep(500);

        // Cambia el estado del chat a "escribiendo" para simular que se está redactando una respuesta
        await chat.sendStateTyping();

        // Espera 1 segundo para simular el tiempo de escritura
        await sleep(1000);

        // Limpia el estado del chat, quitando el estado de "escribiendo"
        await chat.clearState();
    } catch (error) {
        
    }
}
