import { FetchRequestData } from "../base/interfaces";
import { Logger } from "../utils/logger";

/**
 * Funcion que actualiza el campo de la DB que indica que se le entrego una respuesta del pago.
 * @param {number|string} idPayment - ID del pago
 * @returns {Promise<MessageReply>} - La respuesta de la actualizacion.
 */
export async function updatePaymentReport(idPayment:number|string, idUser:string): Promise<Boolean> {
    try {
        
        // Datos para peticion fetch.
        const fetchRequestData: FetchRequestData = {
            URL: "URLS.BASE + URLS.MODULE.SERVICE_PAYMENT_BOT + URLS.METHOD.UPDATE_REPORT",
            method: "PUT",
            body: JSON.stringify({ id: idPayment }),
            headers: {'Content-Type': 'application/json'}
        };
        
        // Peticion a API para obtener datos.
        const response = await fetchRequest(fetchRequestData, idUser);

        // Validar que se haya recibido respuesta.
        if(!response){
            throw new Error();
        }

        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}


export async function fetchRequest(fetchRequestData: FetchRequestData, user: string): Promise<any|null> {
    try {
        const { URL, method, headers, body, options } = fetchRequestData;
        const logger = new Logger();

        await logger.debugFetch(fetchRequestData,user);

        // Configuración de las opciones para la solicitud fetch
        const fetchOptions: RequestInit = {
            method, // Método HTTP
            headers, // Encabezados de la solicitud
            body: method !== "GET" ? body : undefined, // Incluir cuerpo si no es GET
            ...options // Combinar con opciones adicionales si se proporcionan
        };

        // Realizar la solicitud fetch
        const response = await fetch(URL, fetchOptions);
        
        // Verificar si la respuesta es exitosa (código de estado 200-299)
        // if (!response.ok) {
        //     const errorData = await response.json(); // Obtener información adicional del error
        //     throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        // }

        // Retornar la respuesta en formato JSON si es exitosa
        const responseJson = await response.json(); 

        // Registrar respuesta.
        await logger.debugFetch(responseJson,user);

        return responseJson;

    } catch (error:any) {
        const logger = new Logger();
        const dataLog = { 
            function: fetchRequest.name, 
            type: error.name,
            message: error.message
        };

        // Manejo de errores: registrar el error
        await logger.error(dataLog, user);
        
        // Retornar false en caso de error.
        return null; 

    }

}
