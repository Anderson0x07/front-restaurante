import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { IngredienteDto } from 'src/app/dtos/configuracion/ingrediente/ingrediente.dto';
import { CommonModule } from '@angular/common';
import { GestionIngredientesService } from './services/gestion-ingredientes.service';


@Component({
  selector: 'app-gestion-ingredientes',
  templateUrl: './gestion-ingredientes.component.html',
  providers: [CommonModule, GestionIngredientesService, ConfirmationService, MessageService]
})
export class GestionIngredientesComponent implements OnInit {

  constructor(
    private gestionIngredientesService: GestionIngredientesService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public visible = false;
  public itemId: number = -1;
  public header = '';

  public registros: IngredienteDto[] = [];
  public listaFiltro: IngredienteDto[] = [];

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;

  public unidades: SelectItem[] = [
    { value: 'Gramos' }, { value: 'Kilogramos' }, { value: 'Libras' },
    { value: 'Onzas' }, { value: 'Litros' }, { value: 'Mililitros' },
    { value: 'Unidades' }, { value: 'Porciones' }, { value: 'Botellas' },
    { value: 'Paquetes' },
  ]

  ngOnInit(): void {

    this.initForm();
    this.gestionIngredientesService.getAll().subscribe({
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
      nombre: ['', Validators.required],
      descripcion: [''],
      unidad_medida: ['', Validators.required],
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
      const ingrediente: IngredienteDto = this.formulario.value;
      this.gestionIngredientesService.save(ingrediente).subscribe({
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
    const ingredienteEditado: IngredienteDto = this.formulario.value;

    this.gestionIngredientesService.edit(ingredienteEditado, this.itemId).subscribe({
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
    const seguroEliminar = "¿Está seguro de que desea eliminar?"
    this.confirmationService.confirm({
      message: seguroEliminar,
      header: 'Eliminar',
      acceptLabel: 'Si',
      rejectLabel: 'No',
      accept: () => { 
        this.gestionIngredientesService.delete(itemId).subscribe({
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
      this.gestionIngredientesService.findById(itemId).subscribe({
        next: (data) => {
          this.formulario.patchValue({
            nombre: data.nombre,
            descripcion: data.descripcion,
            unidad_medida: data.unidad_medida
          });
        },
        error: (err: {message: string}) => {
          this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: err.message, life: 3000 });
        }
      });
    }
  }

  public listar() {
    this.gestionIngredientesService.getAll().subscribe({
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
      (ingrediente) => ingrediente.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
                      ingrediente.unidad_medida.toLowerCase().includes(this.searchText.toLowerCase()) || 
                      ingrediente.descripcion.toLowerCase().includes(this.searchText.toLowerCase())
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
