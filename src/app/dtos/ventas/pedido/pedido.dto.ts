import { ProductoDto } from "../../configuracion/producto/producto.dto";
import { CompraDto } from "../compra/compra.dto";

export class PedidoDto {

    public id_pedido!: number;

    public compra: CompraDto | any;

    public producto: ProductoDto | any;

    public fecha_pedido!: Date;

    public nota!: string;

    public cantidad!: number;

    public subtotal!: number;

    public comanda!: boolean;

}