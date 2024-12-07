import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';
import { getDataMessage } from "./manager/handleMessage";
import { DEV_USERS, messagesTypesAllowed, ONLY_DEVS } from "./base/constants";

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
                // args: [...PUPPETEER_ARGS_FLAGS]
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

        // Activar escucha de mensajes del cliente de WS.
        client.on('message_create', async (message:Message) => {
            const newMessage = await processNewMessage(message);

            if(!newMessage){
                return;
            }

            console.log(newMessage);
        });

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

const processNewMessage = async (message:Message) => {
    try {
        
        // Obtener de forma legible la informacion del mensaje de WhatsApp
        const messageData = await getDataMessage(message);

        // Validar que se haya obtenido la informacion.
        if(!messageData){
            throw new Error("Ha ocurrido un error al obtener la informacion del mensaje.");
        }

        // Validar que el mensaje NO sea por una actualizacion de status.
        if(messageData.message.isStatus){
            throw new Error("El mensaje no es valido.");
        }

        // Validar que el mensaje este en la lista de tipos de mensajes validos.
        if(!messagesTypesAllowed.includes(messageData.message.type)){
            throw new Error("El tipo de mensaje no es valido.");
        }

        // Validar que el mensaje no sea propio del Bot.
        if(messageData.message.fromMe){
            throw new Error("Mensaje del bot.");
        }

        // Validar que el Bot no este en modo de desarrollo.
        if(ONLY_DEVS && !DEV_USERS.includes(messageData.contact.id)){
            throw new Error("Chat no valido.");
        }

        // Devolver ambas variables.
        return {message, messageData}

    } catch (error:any) {
        console.error(error.message);
        return null;
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