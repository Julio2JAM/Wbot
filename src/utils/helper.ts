import path from "path";
import * as fs from "fs";

const validCountryCodes = [
    "1", "20", "211", "212", "213", "216", "218", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "248", "249", "250", "251", "252", "253", "254", "255", "256", "257", "258", "260", "261", "262", "263", "264", "265", "266", "267", "268", "269", "27", "290", "291", "297", "298", "299", "30", "31", "32", "33", "34", "350", "351", "352", "353", "354", "355", "356", "357", "358", "359", "36", "370", "371", "372", "373", "374", "375", "376", "377", "378", "380", "381", "382", "385", "386", "387", "389", "39", "40", "41", "420", "421", "423", "43", "44", "45", "46", "47", "48", "49", "500", "501", "502", "503", "504", "505", "506", "507", "508", "509", "51", "52", "53", "54", "55", "56", "57", "58", "590", "591", "592", "593", "594", "595", "596", "597", "598", "599", "60", "61", "62", "63", "64", "65", "66", "670", "672", "673", "674", "675", "676", "677", "678", "679", "680", "681", "682", "683", "685", "686", "687", "688", "689", "690", "691", "692", "7", "81", "82", "84", "850", "852", "853", "855", "856", "86", "870", "880", "886", "90", "91", "92", "93", "94", "95", "960", "961", "962", "963", "964", "965", "966", "967", "968", "970", "971", "972", "973", "974", "975", "976", "977", "98", "992", "993", "994", "995", "996", "998"
];
  
export function extractCountryCode(phoneNumber:any) {
    for (let length = 1; length <= 3; length++) {
        const code = phoneNumber.substring(0, length);
        if (validCountryCodes.includes (code)) {
            return code;
        }
    }
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Obtiene la ruta de una imagen por su nombre de archivo.
 * @param {string} fileName El nombre del archivo de la imagen.
 * @returns {string | null} La ruta de la imagen si existe, o null si no se encuentra la imagen.
 */
export function getPathImg(fileName: string): string | null {
    try {
        // Construir la ruta de la imagen
        const rute = path.join(__dirname, `../media/img/${fileName}`);

        // Verificar si la imagen existe
        fs.accessSync(rute, fs.constants.F_OK);

        // Si la imagen existe, devolver la ruta
        return rute;
    } catch (error) {
        // Si ocurre un error (por ejemplo, la imagen no existe), registrar el error y devolver null
        console.log(error);
        return null;
    }
}

export function getDate() {

    // Dias
    const daysName = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

    // Obtener la fecha actual
    const date = new Date();

    // Numero del dia correspondiente.
    const dayNumber = date.getDay();

    // Restar 4 horas
    date.setHours(date.getHours() - 4);
    
    // Formatear la hora actual 
    const horas = date.getHours().toString().padStart(2, '0'); 
    const minutos = date.getMinutes().toString().padStart(2, '0'); 
    const segundos = date.getSeconds().toString().padStart(2, '0'); 
    const horaActual = `${horas}:${minutos}:${segundos}`;

    // Devolver fecha
    return {
        date: date.toISOString().split('T')[0],
        day: daysName[dayNumber],
        time: horaActual
    };
}

// Función para convertir una cadena de hora a un objeto Date 
export function convertirAFecha(horaStr:string) { 
    const [horas, minutos, segundos] = horaStr.split(":").map(Number); 
    const ahora = new Date(); 
    ahora.setHours(horas, minutos, segundos, 0); 
    return ahora; 
}