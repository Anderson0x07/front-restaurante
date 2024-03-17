import { MenuItem } from "primeng/api";

export class UsuarioDTO {
    public id_usuario!: number;
    public nombre!: string;
    //...

    public modulos: Array<MenuItem> | any;
}