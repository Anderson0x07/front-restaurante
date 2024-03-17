import { environment } from "../environment";

export class GestionMesasApiConstant {

    static readonly BASE = 'mesa/'

    static readonly URL_GET_ALL: string = 
    environment.local + this.BASE +
    'all';

    static readonly URL_FIND_BY_ID: string = 
    environment.local + this.BASE;

    static readonly URL_SAVE: string = 
    environment.local + this.BASE +
    'guardar';

    static readonly URL_EDIT: string = 
    environment.local + this.BASE +
    'editar';

    static readonly URL_DELETE: string = 
    environment.local + this.BASE +
    'eliminar';
}