import { MesaDto } from "../../configuracion/mesa/mesa.dto";
import { UsuarioDTO } from "../../configuracion/usuario/usuario.dto";
import { PedidoDto } from "../pedido/pedido.dto";

export class CompraDto {

    public id_compra!: number;

    public mesero: UsuarioDTO | any;

    public mesa: MesaDto | any;

    public fecha_compra!: Date;

    public hora!: string;

    public total!: number;

    public propina!: number;

    public impresion!: boolean;

    public pedidos?: Array<PedidoDto> | any[];

}