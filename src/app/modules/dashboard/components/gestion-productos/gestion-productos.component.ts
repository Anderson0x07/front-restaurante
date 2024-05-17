import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GestionProductosService } from './services/gestion-productos.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoDto } from 'src/app/dtos/configuracion/producto/producto.dto';
import { CategoriaDto } from 'src/app/dtos/configuracion/categoria/categoria.dto';
import { GestionCategoriasService } from '../gestion-categorias/services/gestion-categorias.service';
import { HttpErrorResponse } from '@angular/common/http';
import { url } from 'src/app/modules/shared/utils/Utils';


@Component({
  selector: 'app-gestion-productos',
  templateUrl: './gestion-productos.component.html',
  providers: [CommonModule, GestionProductosService, ConfirmationService, MessageService]
})
export class GestionProductosComponent implements OnInit {

  constructor(
    private gestionProductosService: GestionProductosService,
    private gestionCategoriasService: GestionCategoriasService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public url = url;


  @ViewChild('examinarInput') examinarInput?: ElementRef<HTMLInputElement>;


  public visible = false;
  public itemId: number = -1;
  public header = '';

  public registros: ProductoDto[] = [];
  public listaFiltro: ProductoDto[] = [];

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;

  public descuentos: SelectItem[] = [
    { label: "5%", value: 5 }, { label: "10%", value: 10 }, { label: "15%", value: 15 }, { label: "20%", value: 20 }
  ]

  public categorias: SelectItem[] = [];

  public categoriasCargadas: boolean = false;

  previewUrl!: any;

  imagenSeleccionada: string = '';
  fileName: string = '';

  
  selectFile() {
    const input = this.examinarInput?.nativeElement as HTMLInputElement;
    input.click();
  }

  onFileSelected(event: any) {
    
    const file = event.target.files[0];

    if (!file) return;

    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = (base: any) => {

      const previsualizar = base.target.result;

      const base64String = previsualizar.split(',')[1];

      this.imagenSeleccionada = base64String;

      this.previewUrl = previsualizar;
    };

    reader.readAsDataURL(file);
  }


  ngOnInit(): void {

    this.initForm();
    this.gestionProductosService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
      },
    });

    this.gestionCategoriasService.getAll().subscribe({
      next: (data) => {
        data.forEach((item: CategoriaDto) => {
          const categoria: SelectItem = { label: item.nombre, value: item.id_categoria }
          this.categorias.push(categoria)
        })
      },
      complete: () => {
        this.categoriasCargadas = true;
      }
    })
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      precio: ['', Validators.required],
      descuento: [''],
      stock: [''],
      estado: [false],
      categoria: ['', Validators.required],
    });

    this.formulario.get('stock')?.valueChanges.subscribe((nuevoValor: number) => {
      if(nuevoValor > 0) {
        this.formulario.get('estado')?.setValue(true)
      }
    })
  }

  public isValidField(field: string): boolean | null {
    return (
      this.formulario.controls[field].errors &&
      this.formulario.controls[field].touched
    );
  }
    
  public enviarModal() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.messageService.clear();

    if (this.itemId != -1) {
      this.editar();
    } else {
      this.registrar();
    }
  }

  public registrar() {

      const formValue = this.formulario.value;

      const producto: ProductoDto = new ProductoDto();

      producto.nombre = formValue.nombre
      producto.descripcion = formValue.descripcion
      producto.precio = formValue.precio
      producto.descuento = formValue.descuento
      producto.stock = formValue.stock
      producto.estado = formValue.estado
      producto.categoria = {
        id_categoria: formValue.categoria
      }

      producto.imagen = "";

      // if (this.imagenSeleccionada != "") {
      //   producto.imagen = this.imagenSeleccionada + " " + this.fileName;
      // } else {
      //   this.messageService.add({severity: 'warn', summary: 'Advertencia', detail: 'Debe seleccionar una imagen para el producto'});
      //   return;
      // }

      this.gestionProductosService.save(producto).subscribe({
        next: (res: {message: string}) => {
          this.visible = false;
          this.listar();
          this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: res.message, life: 3000 });
        },
        error: (err: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.errors.join(''), life: 3000 });
        },
      });
  }

  public editar() {

    const formValue = this.formulario.value;

    const productoEditado: ProductoDto = new ProductoDto();

    productoEditado.nombre = formValue.nombre
    productoEditado.descripcion = formValue.descripcion
    productoEditado.precio = formValue.precio
    productoEditado.descuento = formValue.descuento
    productoEditado.stock = formValue.stock
    productoEditado.estado = formValue.estado
    productoEditado.categoria = {
      id_categoria: formValue.categoria
    }

    productoEditado.imagen = this.imagenSeleccionada;

    if (!this.imagenSeleccionada.includes('http')) {
      productoEditado.imagen = this.imagenSeleccionada + " " + this.fileName;
    } else {
      productoEditado.imagen = "";
    }

    this.gestionProductosService.edit(productoEditado, this.itemId).subscribe({
      next: (data: {message: string}) => {
        this.visible = false;
        this.listar();
        this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: data.message, life: 3000 });
      },
      error: () => {
        this.visible = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
      },
    });
  }


  public eliminar(itemId: number) {
    this.messageService.clear();

    this.gestionProductosService.findById(itemId).subscribe({
      next: (data) => {

        if(data.stock > 0 || data.pedidos.length > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar, está en uso', life: 3000 });

        } else {
          this.confirmarEliminacion(itemId);
        }
      }
    })
  }

  public confirmarEliminacion(itemId: number) {
    this.messageService.clear();
    const seguroEliminar = "¿Está seguro de que desea eliminar?"
    this.confirmationService.confirm({
      message: seguroEliminar,
      header: 'Eliminar',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      rejectIcon: 'pi pi-times',
      acceptIcon: 'pi pi-check',
      rejectButtonStyleClass: 'p-button-danger p-button-outlined p-button-rounded gap-2',
      acceptButtonStyleClass: 'p-button-success p-button-rounded gap-2',
      accept: () => { 
        this.gestionProductosService.delete(itemId).subscribe({
          next: (res: {message: string}) => {
            this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: res.message, life: 3000 });
            this.listar();
          },
          error: (err: {message: string}) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
          }
        });
      }
    });
  }

  public abrirModal(itemId: number) {
    this.visible = true;
    this.itemId = itemId;
    if (itemId === -1) {
      this.previewUrl = '';

      this.formulario.reset();
      this.header = 'Añadir elemento';

    } else {
      this.header = 'Editar elemento';
      this.gestionProductosService.findById(itemId).subscribe({
        next: (data) => {

          this.imagenSeleccionada = data.imagen;
          this.previewUrl = this.url + data.imagen;
          this.formulario.patchValue({
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            descuento: data.descuento,
            stock: data.stock,
            categoria: data.categoria.id_categoria,
            estado: data.estado
          });
        },
        error: (err: {message: string}) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
        }
      });
    }
  }

  public listar() {
    this.gestionProductosService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: (err: {message: string}) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
      }
    });
  }


  public search() {
    this.listaFiltro = this.registros.filter(
      (item) => item.nombre.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.descripcion.toLowerCase().includes(this.searchText.toLowerCase()) || 
        item.precio.toString().includes(this.searchText) ||
        item.stock?.toString().includes(this.searchText) ||
        item.descuento?.toString().includes(this.searchText) ||
        item.categoria.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  public getImagen(producto: ProductoDto): string {

    if(producto.imagen === "") {
      switch(producto.categoria.nombre) {
        case 'Burguers':
          return this.url + 'icono-burguer';
        case 'Hot Dogs':
          return this.url + 'icono-hot-dog';
        case 'Salchis Magicas':
          return this.url + 'icono-salchipapa';
        case 'Cortes de Carne':
          return this.url + 'icono-carne';
        case 'Frapes':
          return this.url + 'icono-frappe';
        case 'Cervezas':
          return this.url + 'icono-cerveza';
        case 'Sodas':
          return this.url + 'icono-soda';
        case 'Micheladas':
          return this.url + 'icono-michelada';
        case 'Cocteles':
          return this.url + 'icono-coctel';
        default:
          break;
      }
    } 
    
    return this.url + (producto.imagen === "" ? 'default' : producto.imagen);
  }


  //PAGINACION
  public next() {
    this.first = this.first + this.rows;
  }
  public prev() {
    this.first = this.first - this.rows;
  }
  public isLastPage(): boolean {
    return this.listaFiltro
      ? this.first === this.listaFiltro.length - this.rows
      : true;
  }
  public isFirstPage(): boolean {
    return this.listaFiltro ? this.first === 0 : true;
  }

}
