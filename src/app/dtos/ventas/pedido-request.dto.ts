import { PedidoDto } from "./pedido/pedido.dto"

export class PedidosCompraMesaDto {
    public mesaId!: number
    public meseroId!: number
    public pedidoDtos: Array<PedidoDto> | any

}