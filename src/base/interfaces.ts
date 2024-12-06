import { Contact, Message, MessageMedia } from "whatsapp-web.js"

export interface DataMessage {
    contact: {
        id: string,
        number: string | null,
        name: string | null,
        isGroup: Boolean
        countryCode: string | null
    },
    chat: {
        id: string,
        unreadCount: number,
        archived: boolean
    },
    message: {
        id: string,
        type: string,
        body: string,
        fromMe: Boolean,
        timestamp: number,
        idReplied: string | null,
    },
    wpMessage: Message
}

export interface MessageReply{
    message: string | Contact
    media: null | MessageMedia
}

export interface DataUser{
    command: string | null,
    message: string[],
    timestamp: number,
    followable: boolean,
}

// Interfaz que define la estructura del objeto de solicitud
export interface FetchRequestData {
    URL: string; // URL de la API a la que se realizará la solicitud
    method: "PUT" | "GET" | "POST"; // Método HTTP a utilizar
    headers?: { [name: string]: string }; // Encabezados de la solicitud
    body?: BodyInit; // Datos a enviar en el cuerpo de la solicitud (opcional)
    options?: RequestInit; // Opciones adicionales para fetch (opcional)
}