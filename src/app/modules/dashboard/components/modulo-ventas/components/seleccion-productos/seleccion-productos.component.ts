import { Component, Input, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { CategoriaDto } from 'src/app/dtos/configuracion/categoria/categoria.dto';
import { MesaDto } from 'src/app/dtos/configuracion/mesa/mesa.dto';
import { GestionCategoriasService } from '../../../gestion-categorias/services/gestion-categorias.service';
import { GestionProductosService } from '../../../gestion-productos/services/gestion-productos.service';
import { ProductoDto } from 'src/app/dtos/configuracion/producto/producto.dto';

@Component({
  selector: 'app-seleccion-productos',
  templateUrl: './seleccion-productos.component.html'
})
export class SeleccionProductosComponent implements OnInit {

  constructor(
    private gestionCategoriasService: GestionCategoriasService,
    private gestionProductosService: GestionProductosService,
    private messageService: MessageService
  ) { }

  @Input() mesa!: MesaDto

  public url = "https://elasticbeanstalk-us-east-1-475704544382.s3.amazonaws.com/images/";

  public categorias: SelectItem[] = [];

  public productos!: ProductoDto[]; // ProductoDto

  public productosFiltrados: ProductoDto[] = [];

  public categoriasCargadas: boolean = false;

  public visible: boolean = false;

  public fotoProducto: string = ''

  public productoSeleccionado!: ProductoDto;

  public cantidadSeleccionada: number = 0;

  public productosSeleccionados: Array<{id_producto: number, cantidad: number}> = [];

  ngOnInit() {

    this.gestionProductosService.getAll().subscribe({
      next: (data) => {

        
        this.productos = data.filter(producto => producto.estado);
        this.productosFiltrados = data.filter(producto => producto.estado);
      }
    });

    this.gestionCategoriasService.getAll().subscribe({
      next: (data) => {
        data.forEach((item: CategoriaDto) => {
          const categoria = { label: item.nombre, value: item.id_categoria }
          this.categorias.push(categoria)
        })
      },
      complete: () => {
        this.categoriasCargadas = true;
      }
    });
  }


  onSortChange(event: any) {
    let value = event.value;
    this.productosFiltrados = this.productos.filter(item => item.categoria.id_categoria == value);

    console.log(this.productosFiltrados)
  }

  getSeverity(producto: ProductoDto): string {
    return producto.stock && producto.stock <= 0 ? 'danger' : 'success';
  };

  public abrirModalAgregarProducto(productoSeleccionado: ProductoDto): void {
    console.log('Producto agregado: ', productoSeleccionado)

    this.visible = true;

    this.fotoProducto = this.url + productoSeleccionado.imagen;
    this.productoSeleccionado = productoSeleccionado;

    
  }
  
  public agregarCarrito() {
    console.log(this.productoSeleccionado)
    this.productosSeleccionados.push({id_producto: this.productoSeleccionado.id_producto, cantidad: this.cantidadSeleccionada});
    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Producto agregado al carrito', life: 3000 });

    console.log(this.productosSeleccionados)
    
  }

  public hayDisponibilidad(): boolean {
    return this.productoSeleccionado.stock > this.cantidadSeleccionada;

  }

  seleccionarCantidad(operacion: string) {
    if(operacion == 'suma') {
      this.cantidadSeleccionada++;
    } else if(operacion == 'resta' && this.cantidadSeleccionada > 0){
      this.cantidadSeleccionada--;
    }
  }


}
