import { Command } from "./interfaces";
import { MAIN_MESSAGE, PAY_MESSAGE, PROMOTION } from "./messages";
import { genericResponse, information, myData, promotion, report } from "../manager/handleService";

export const COMMANDS:Command = {
    "INICIO":{
        subcommands:{
            1:"PAGO",
            2:"REPORTE",
            3:"PROMO",
            4:"INSTALACIONES",
            5:"INFORMACION",
        },
        action:genericResponse,
        message:MAIN_MESSAGE,
        steps:2
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
        message:PROMOTION,
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
    //? En desarrollo
    "MI_INFORMACION":{
        subcommands:null,
        action:myData,
        message:null,
        steps:0
    },
}