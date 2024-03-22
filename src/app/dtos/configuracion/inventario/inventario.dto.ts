import { IngredienteDto } from "../ingrediente/ingrediente.dto"

export class InventarioDto {
    public id_inventario!: number
    public ingrediente: IngredienteDto | any
    public cantidad!: number
    public fecha_ingreso!: Date
}