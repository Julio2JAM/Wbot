import { Command } from "./interfaces";
import { INSTALL, MAIN_MESSAGE, PAY_MESSAGE, PROMOTION } from "./messages";
import { genericResponse, information, mainMessage, myData, promotion, report } from "../manager/handleService";

export const COMMANDS:Command = {
    "INICIO":{
        subcommands:{
            1:"PAGO",
            2:"REPORTE",
            3:"PROMO",
            4:"INSTALACIONES",
            5:"INFORMACION",
            6:"MIS_DATOS",
            7:"CONSULTAR",
        },
        action:mainMessage,
        message:MAIN_MESSAGE,
        steps:0
    },
    "PAGO":{
        subcommands:null,
        action:genericResponse,
        message:PAY_MESSAGE,
        steps:0
    },
    "REPORTE":{
        subcommands:{
            0:"INICIO",
        },
        action:report,
        message:null,
        steps:2
    },
    "PROMO":{
        subcommands:null,
        action:promotion,
        message:PROMOTION,
        steps:0
    },
    "INSTALACIONES":{
        subcommands:null,
        action:promotion,
        message:INSTALL,
        steps:0
    },
    "INFORMACION":{
        subcommands:{
            0:"INICIO",
        },
        action:information,
        message:null,
        steps:1
    },
    "MIS_DATOS":{
        subcommands:null,
        action:myData,
        message:null,
        steps:0
    },
    "CONSULTAR":{
        subcommands:null,
        action:myData,
        message:null,
        steps:1
    },
}

export const ADMIN_COMMANDS = [
    "CONSULTAR"
]