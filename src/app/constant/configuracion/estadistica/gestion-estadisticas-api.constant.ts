import { environment } from "../../environment";

export class GestionEstadisticasApiConstant {

    static readonly BASE = 'compra/'

    static readonly URL_GET_STATS: string = 
    environment.local + this.BASE +
    'estadisticas';
}