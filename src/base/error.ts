// import { Logger } from "../utils/logger";
import { Logger } from "../utils/logger";
import { ErrorMessageReply, HTTP_STATUS } from "./constants";

export class NotFound extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'NotFound';
    }
}

export class BadRequest extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequest';
    }
}

export class InternalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InternalError';
    }
}
  
export class InvalidData extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "InvalidData";
    }
}

export function handleError(err: unknown) {

    if (!(err instanceof Error)) {
        const status = HTTP_STATUS.INTERNAL_SERVER_ERROR;
        return { status, response:{ message: 'Ha ocurrido un error inesperado.', status: status }};
    }

    const errorMap: { [key: string]: number } = {
        NotFound: HTTP_STATUS.NOT_FOUND,
        BadRequest: HTTP_STATUS.BAD_REQUEST,
        InvalidData: HTTP_STATUS.BAD_REQUEST,
    };

    const status = errorMap[err.name] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return { status, response:{ message: err.message, status: status }};

}


export function handleErrorMessage(e: any, called:string, idUser:string) {
    
    // Obtener los datos del mensaje de respuesta de error.
    const MessageReply = {...ErrorMessageReply};
    
    // Validar que el error sea una exception esperada ( throw new InvalidData() ), para obtener su mensaje
    if(e instanceof InvalidData && e?.message){
        MessageReply.message = e.message;
    }

    // Contruccion de la data que se va a registrar.
    const dataLog = { 
        function: called, 
        type: e.name,
        message: e.message
    };

    // Registrar data en los logs
    const log = new Logger();
    log.error(dataLog, idUser);

    // Enviar respuesta.
    return MessageReply;

}

