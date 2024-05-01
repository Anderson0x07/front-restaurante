import { environment } from "../../environment";

export class GestionComprasApiConstant {

    static readonly BASE = 'compra/'

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


    static readonly URL_LISTAR_COMPRAS_BY_FECHA: string = 
    environment.local + this.BASE +
    'dia';

    static readonly URL_LISTAR_COMPRAS_BY_RANGO_FECHAS: string = 
    environment.local + this.BASE +
    'fecha';

    static readonly URL_COMPRA_ACTUAL_MESA: string = 
    environment.local + this.BASE +
    'actual';

    static readonly URL_PROPINA_COMPRA: string = 
    environment.local + this.BASE +
    'propina';

    static readonly URL_EXPORT_REPORTE_DIARIO: string = 
    environment.local + this.BASE +
    'informe';
}