import { environment } from "../../environment";

export class GestionRolApiConstant {

    static readonly BASE = 'rol/'

    static readonly URL_GET_ALL: string = 
    environment.local + this.BASE +
    'all';

}