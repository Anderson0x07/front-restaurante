import { ProductoDto } from "../producto/producto.dto"

export class EstadisticaDto {
    cantidadCompras!: number
    totalVentas!: number
    totalPropinas!: number
    productosDto!: Array<ProductoDto>
    cantidadProductos!: number

}