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

  categorias: SelectItem[] = [];

  sortOrder!: number;

  sortField!: string;

  productos!: any[]; // ProductoDto

  public categoriasCargadas: boolean = false;

  ngOnInit() {

    console.log("Mesa seleccionada: ", this.mesa)

    this.gestionProductosService.getAll().subscribe({
      next: (data) => {
        this.productos = data
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
    console.log(event)
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  getSeverity(producto: ProductoDto): string {
    return !producto.stock && producto.stock <= 0 ? 'danger' : 'success';
  };

  public agregarCarrito(productoSeleccionado: any): void {
    console.log('Producto agregado: ', productoSeleccionado)

    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Producto agregado al carrito', life: 3000 });

  }


}
