// import { Logger } from "../utils/logger";
import { HTTP_STATUS } from "./constants";

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
        Unauthorized: HTTP_STATUS.UNAUTHORIZED
    };

    const status = errorMap[err.name] || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    return { status, response:{ message: err.message, status: status }};

}

