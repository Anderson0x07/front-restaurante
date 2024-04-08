import { CategoriaDto } from "../categoria/categoria.dto"

export class ProductoDto {
    public id_producto!: number
    public descripcion!: string
    public descuento!: number
    public imagen!: string 
    public nombre!: string 
    public precio!: number
    public stock!: number
    public estado!: boolean
    public categoria: CategoriaDto | any

}