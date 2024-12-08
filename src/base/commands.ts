import { Command } from "./interfaces";
import { MAIN_MESSAGE } from "./messages";
import { genericResponse, myData, report } from "../manager/handleService";

export const COMMANDS:Command = {
    "INICIO":{
        subcommands:{
            1:"MI_INFORMACION",
            2:"REPORTE",
        },
        action:genericResponse,
        message:MAIN_MESSAGE,
        steps:2
    },
    "MI_INFORMACION":{
        subcommands:null,
        action:myData,
        message:null,
        steps:0
    },
    "REPORTE":{
        subcommands:{
            0:"INICIO",
        },
        action:report,
        message:null,
        steps:0
    }
}