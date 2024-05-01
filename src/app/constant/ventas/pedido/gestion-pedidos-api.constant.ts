import { environment } from "../../environment";

export class GestionPedidosApiConstant {

    static readonly BASE = 'pedido/'

    static readonly URL_GET_ALL: string = 
    environment.local + this.BASE +
    'all';

    static readonly URL_FIND_BY_ID: string = 
    environment.local + this.BASE;

    static readonly URL_SAVE: string = 
    environment.local + this.BASE +
    'guardar';

    static readonly URL_CONFIRMAR_PEDIDO: string = 
    environment.local + this.BASE +
    'compra';

}