import { config } from 'dotenv';
import { MessageTypes } from 'whatsapp-web.js';
import { MessageReply } from './interfaces';
import { UNEXPECTED_ERROR } from './messages';
config();

// Mensaje en caso de error
export const ErrorMessageReply:MessageReply = {
    message: UNEXPECTED_ERROR,
    media: null
}

// Numero de telefono del BOT
export const ME = process.env.MY_NUMBER ?? "";

// Flag para debbugear en procesos de desarrollo.
export const ACTIVE_DEBUG = process.env.DEBUG;

// Filtro de respuesta del bot solo para los numeros en 'DEV_USERS'
export const ONLY_DEVS = process.env.ONLY_DEVS ?? 0;

// Lista de numeros de telefonos permitidos para ser respondidos en caso de activar el filtro de respuesta.
export const DEV_USERS = process.env.DEV_USERS?.trim().split(',') ?? [];

// Entornos
export const ENVIROMENT: any = {
    DEV : process.env.DEV,
    CERT: process.env.CERT,
    PROD: process.env.PROD,
    CURRENT: process.env.ENV || "PROD"
};

export const SERVER = {
    PORT: process.env.PORT || 3000,
}

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NOT_MODIFIED: 304,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

export const PUPPETEER_ARGS_FLAGS: string[] = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    // '--incognito',
    '--single-process',
    '--no-zygote',
    '--no-first-run',
    // `--window-size=${options.width || 1280},${options.height || 800}`,
    // '--window-position=0,0',
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-skip-list',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--disable-gpu',
    '--hide-scrollbars',
    '--disable-notifications',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-component-extensions-with-background-pages',
    '--disable-extensions',
    '--disable-features=TranslateUI,BlinkGenPropertyTrees',
    '--disable-ipc-flooding-protection',
    '--disable-renderer-backgrounding',
    '--enable-features=NetworkService,NetworkServiceInProcess',
    '--force-color-profile=srgb',
    '--metrics-recording-only',
    '--mute-audio'
];

export const messagesTypesAllowed: MessageTypes[] = [
    MessageTypes.TEXT,
    MessageTypes.AUDIO,
    MessageTypes.VOICE,
    MessageTypes.IMAGE,
    MessageTypes.VIDEO,
    MessageTypes.DOCUMENT,
    MessageTypes.STICKER,
    MessageTypes.LOCATION,
    MessageTypes.CONTACT_CARD,
    MessageTypes.CONTACT_CARD_MULTI,
    MessageTypes.REVOKED,
]
