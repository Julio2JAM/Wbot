import { Command } from "./interfaces";
import { MAIN_MESSAGE } from "./messages";
import { genericResponse, myData, report } from "../manager/handleService";
import { info } from "console";

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
        message:null,
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
        action:genericResponse,
        message:null,
        steps:0
    },
    "INSTALACIONES":{
        subcommands:null,
        action:genericResponse,
        message:null,
        steps:0
    },
    "INFORMACION":{
        subcommands:null,
        action:info,
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