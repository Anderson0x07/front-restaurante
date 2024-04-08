import { RolDto } from "./rol.dto";

export class UsuarioDTO {
    public id_usuario?: number;
    public nombre!: string;
    public apellido!: string;
    public imagen?: string;
    public documento!: string;
    public telefono!: string;
    public estado!: boolean;
    public email!: string;
    public password?: string;
    public rol: RolDto | any;
    
}