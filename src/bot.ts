import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';
import { getDataMessage, getReadyToResponse, getResponse } from "./manager/handleMessage";
import { DEV_USERS, messagesTypesAllowed, ONLY_DEVS, PUPPETEER_ARGS_FLAGS } from "./base/constants";
import { DataMessage } from "./base/interfaces";
import { Logger } from "./utils/logger";
import { isSpam } from "./manager/handleUser";
import fastq from "fastq";
import { sleep } from "./utils/helper";

const initClientWs = (): Client|null => {
    try {

        // Crear instancia del cliente.
        const client = new Client({
            restartOnAuthFail: true,
            takeoverOnConflict: true,
            qrMaxRetries: 4,
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: [...PUPPETEER_ARGS_FLAGS]
            },
        });

        // Indicar que el cliente esta listo.
        client.once('ready', () => {
            console.log('Client is ready!');
        });

        // Mostrar qr.
        client.on('qr', qr => {
            qrcode.generate(qr, {small: true});
        });

        // Start your client
        client.initialize();

        return client;

    } catch (error) {
        console.log(error);
        return null;
    }
}

const enableWS = (client:Client):boolean => {
    try {

        // Funcion de encolamiento para evitar baneos.
        const messageQueue = fastq.promise(processMessage, 1);

        // Activar escucha de mensajes del cliente de WS.
        // Recibe el mensaje, y lo manda a la funcion "processMessage", de forma encolada.
        client.on('message_create', async (message:Message) => messageQueue.push(message) );

        //! Importante: 
        // Este evento convierte los mensajes cifrados a mensajes normales
        // Por lo tanto, es necesario que sea ejecutado, y se deja vacio
        // Para que el proceso de manejo del mensaje, lo realice 'message_create'.
        client.on('message_ciphertext', async () => {});

        return true;

    } catch (error) {
        console.error('Error enabling client:', error);
        return false;
    }
}

const processMessage = async (message:Message):Promise<any> => {
    try {

        // Obtiene el chat del mensaje
        const chat = await message.getChat();

        // Obtener de forma legible la informacion del mensaje de WhatsApp
        const messageData = await getDataMessage(message, chat);

        // Validar que se haya obtenido la data formateada.
        if(!messageData){
            return;
        }
        
        // Validar Mensaje.
        if(!isValidMessage(messageData)){
            return;
        }

        // Registrar mensaje en un log.
        const logger = new Logger();
        logger.message(messageData);

        // Validar que el mensaje no sea propio del Bot.
        if(messageData.message.fromMe){
            return;
        }

        // Prepara mensaje para respuesta.
        await getReadyToResponse(chat);

        // Obtener respuesta.
        const response = await getResponse(messageData);

        // Responder mensaje.
        message.reply(response.message, undefined, {
            media:response.media ?? undefined
        });

        // Esperar 300 milisegundos para manejar el siguiente mensaje.
        await sleep(300);

    } catch (error) {}
}

const isValidMessage = (messageData:DataMessage):Boolean => {
    try {
        
        // Validar que se haya obtenido la informacion.
        if(!messageData){
            throw new Error("Ha ocurrido un error al obtener la informacion del mensaje.");
        }

        // Validar que el mensaje NO sea por una actualizacion de status.
        if(messageData.contact.isGroup){
            throw new Error("El mensaje no es valido.");
        }

        // Validar que el mensaje NO sea por una actualizacion de status.
        if(messageData.message.isStatus){
            throw new Error("El mensaje no es valido.");
        }

        // Validar que el mensaje este en la lista de tipos de mensajes validos.
        if(!messagesTypesAllowed.includes(messageData.message.type)){
            throw new Error("El tipo de mensaje no es valido.");
        }

        // Validar que el Bot no este en modo de desarrollo.
        if(ONLY_DEVS && !DEV_USERS.includes(messageData.contact.id) && !messageData.message.fromMe){
            throw new Error("Chat no valido.");
        }

        // Validar que el mensaje sea SPAM.
        if(isSpam(messageData)){
            throw new Error("El usuario esta en la lista de SPAM.");
        }

        // Devolver ambas variables.
        return true

    } catch (error:any) {
        console.error(error.message);
        return false;
    }
}

export function initServiceWS(){
    try {
        const client = initClientWs();

        if(!client){
            throw new Error("Ocurrio un error al iniciar el cliente de WhatsApp.");
        }

        const enableWs = enableWS(client);

        if(!enableWs){
            throw new Error("Ocurrio un error al habilitar WhatsApp.");
        }

        return client;
    } catch (error) {
        console.error('Error service WhatsApp:', error);
        return null;
    }
}