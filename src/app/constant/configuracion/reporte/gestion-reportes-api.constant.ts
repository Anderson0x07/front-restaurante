import { environment } from "../../environment";

export class GestionReportesApiConstant {

    static readonly BASE = 'usuario/'

    static readonly URL_SEND_REPORT: string = 
    environment.local + this.BASE +
    'informe';

}