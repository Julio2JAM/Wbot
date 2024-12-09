import * as fs from "fs";
import path from "path";
import { DataMessage, FetchRequestData } from "../base/interfaces";

export class Logger {
    
    private logFilePath: string;
    private directoryBase: string;

    constructor() {
        this.logFilePath = path.join(__dirname, `../log/${this.fileName()}.log`);
        this.directoryBase = path.join(__dirname, `../log/`);
    }

    public fileName(): string {
    
        // Obtener la fecha actual
        const date = new Date();
    
        // Restar 4 horas
        date.setHours(date.getHours() - 4);

        // Obtener los componentes de la fecha
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Sumar 1 al mes ya que los meses van de 0 a 11
        const day = String(date.getDate()).padStart(2, '0');
    
        // Formatear la fecha en el formato deseado
        const dateFormatted = `${year}-${month}-${day}`;
    
        return dateFormatted;
    
    }

    private log(user: string, type: "INPUT" | "OUTPUT" | "INFO" | "ERROR" | "DEBUG", data: string):void {
        try {

            // Obtener fecha en un formato deseado
            const date = new Date();

            // Restar 4 horas
            date.setHours(date.getHours() - 4);

            // Obtener la fecha en el formato deseado.
            const dateFormatted = date.toLocaleString("sv-SE");

            // Concatenar la fecha y la informacion que sera almacenada
            const formattedMessage = `${dateFormatted} ${type} ${user}: ${data}\n`;

            // Validar que exista el directio donde se almacenaran los logs
            if (!fs.existsSync(this.directoryBase)){
                fs.mkdirSync(this.directoryBase);
            }
            
            // Crear si no existe el archivo log para escribir datos en el
            fs.appendFile(this.logFilePath, formattedMessage, (err) => {
                if (err) throw err;
                console.log('¡El nuevo texto se agregó al archivo!');
            });

        } catch (error) {
            console.log('Error: ' + error);
        }
    }

    public async message(messageData: DataMessage):Promise<void> {

        // Obtener data para el log
        const user = parseInt(messageData.contact.id) ? `+${messageData.contact.id}` : messageData.contact.id;
        const type = messageData.message.fromMe ? "OUTPUT" : "INPUT";
        const data = JSON.stringify({
            id: messageData.message.id,
            type: messageData.message.type,
            content: messageData.message.body,
            idReplied: messageData.message.idReplied,
            timestamp: messageData.message.timestamp,
        });

        // Crear log
        this.log(user,type,data);

    }

    public async debugFetch(dataLog: /*Response*/ any | FetchRequestData, idUser:string):Promise<void> {

        // Obtener data para el log
        const user = `+${parseInt(idUser)}`;
        const type = "DEBUG";
        const dataCloned = dataLog;

        if(dataLog.body && dataLog.body instanceof FormData) {
            dataCloned.body = Object.fromEntries(dataCloned.body.entries());
        }

        const data = JSON.stringify(dataCloned);

        // Crear log
        this.log(user,type,data);
    }

    public async error(error: any, idUser:string):Promise<void> {

        // Obtener data para el log
        const user = `+${parseInt(idUser)}`;
        const type = "ERROR";
        const data = JSON.stringify(error);

        // Crear log
        this.log(user,type,data);

    }
    
}
