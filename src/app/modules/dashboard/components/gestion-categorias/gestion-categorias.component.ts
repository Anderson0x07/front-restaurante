import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriaDto } from 'src/app/dtos/configuracion/categoria/categoria.dto';
import { CommonModule } from '@angular/common';
import { GestionCategoriasService } from './services/gestion-categorias.service';


@Component({
  selector: 'app-gestion-categorias',
  templateUrl: './gestion-categorias.component.html',
  providers: [CommonModule, GestionCategoriasService, ConfirmationService, MessageService]
})
export class GestionCategoriasComponent implements OnInit {

  constructor(
    private gestionCategoriasService: GestionCategoriasService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public visible = false;
  public itemId: number = -1;
  public header = '';

  public registros: CategoriaDto[] = [];
  public listaFiltro: CategoriaDto[] = [];

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;

  ngOnInit(): void {

    this.initForm();
    this.gestionCategoriasService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
      },
    });
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required]
    });
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
      const categoria: CategoriaDto = this.formulario.value;
      this.gestionCategoriasService.save(categoria).subscribe({
        next: (res: {message: string}) => {
          this.visible = false;
          this.listar();
          this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: res.message, life: 3000 });
        },
        error: () => {
          this.visible = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
        },
      });
  }

  public editar() {
    const categoriaEditada: CategoriaDto = this.formulario.value;

    this.gestionCategoriasService.edit(categoriaEditada, this.itemId).subscribe({
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

    this.gestionCategoriasService.findById(itemId).subscribe({
      next: (data) => {

        if(data.productos.length > 0) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se puede eliminar, está en uso', life: 3000 });


        } else {
          this.confirmarEliminacion(itemId);
        }
      }
    })    
  }

  private confirmarEliminacion(itemId: number) {
    const seguroEliminar = "¿Está seguro de que desea eliminar?"
    this.confirmationService.confirm({
      message: seguroEliminar,
      header: 'Eliminar',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => { 
        this.gestionCategoriasService.delete(itemId).subscribe({
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
      this.formulario.reset();
      this.header = 'Añadir elemento';

    } else {
      this.header = 'Editar elemento';
      this.gestionCategoriasService.findById(itemId).subscribe({
        next: (data) => {
          this.formulario.patchValue({
            nombre: data.nombre,
          });
        },
        error: (err: {message: string}) => {
          this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: err.message, life: 3000 });
        }
      });
    }
  }

  public listar() {
    this.gestionCategoriasService.getAll().subscribe({
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
      (categoria) => categoria.nombre.toLowerCase().includes(this.searchText.toLowerCase())
    );
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
