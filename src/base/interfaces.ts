import { Contact, MessageMedia, MessageTypes } from "whatsapp-web.js"

export interface DataMessage {
    contact: {
        id: string,
        number: string | null,
        name: string | null,
        isGroup: Boolean
        countryCode: string | null
    },
    chat: {
        unreadCount: number,
        archived: boolean
    },
    message: {
        id: string,
        type: MessageTypes,
        body: string,
        fromMe: Boolean,
        isStatus: Boolean,
        timestamp: number,
        idReplied: string | null,
    },
    functions?: {
        react: Function
        reply: Function
    }
}

export interface MessageReply{
    message: string | Contact
    media: null | MessageMedia
}

export interface CommandData{
    subcommands:{[number:string]:string} | null
    action:Function
    message:string | null
    steps: number
}

export interface Command{
    [name: string]:CommandData
}

export interface DataUser{
    commandName: string,
    timestamp: number,
    step: number
    extraInfo?:any
    messagesInRange:number
}

export interface UserHistory{
    [user: string|number]:DataUser|null
}

// Interfaz que define la estructura del objeto de solicitud
export interface FetchRequestData {
    URL: string; // URL de la API a la que se realizará la solicitud
    method: "PUT" | "GET" | "POST"; // Método HTTP a utilizar
    headers?: { [name: string]: string }; // Encabezados de la solicitud
    body?: BodyInit; // Datos a enviar en el cuerpo de la solicitud (opcional)
    options?: RequestInit; // Opciones adicionales para fetch (opcional)
}

export interface ErrorResponse{
    response: {message: string, status: number},
    status: number
}

export interface SuccessResponse{ 
    response: unknown;
    status: number; 
};