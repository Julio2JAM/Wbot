import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

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

// Función para habilitar las funciones del cliente.
function enableWS(client:Client):boolean{
    try {

        // Activar escucha de mensajes del cliente de WS.
        client.on('message_create', async (message:Message) => {
            console.log(message);
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