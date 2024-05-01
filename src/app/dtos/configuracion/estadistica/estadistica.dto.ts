import { ProductoDto } from "../producto/producto.dto"

export class EstadisticaDto {
    cantidadCompras!: number
    totalVentas!: number
    productosDto!: Array<ProductoDto>
    cantidadProductos!: number

}