import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionMesasService } from './services/gestion-mesas.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MesaDto } from 'src/app/dtos/configuracion/mesa/mesa.dto';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gestion-mesas',
  templateUrl: './gestion-mesas.component.html',
  providers: [CommonModule, GestionMesasService, ConfirmationService, MessageService]
})
export class GestionMesasComponent implements OnInit {

  constructor(
    private gestionMesasService: GestionMesasService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public visible = false;
  public itemId: number = -1;
  public header = '';

  public registros: MesaDto[] = [];
  public listaFiltro: MesaDto[] = [];

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;

  capacidades: MenuItem[] = [
    { value: 1 }, { value: 2 }, { value: 3 },
    { value: 4 }, { value: 5 }, { value: 6 },
  ];

  ngOnInit(): void {

    this.initForm();
    this.gestionMesasService.getAll().subscribe({
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
      numero: ['', Validators.required],
      capacidad: ['', Validators.required],
      estado: [false],
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

      const mesa: MesaDto = this.formulario.value;
      mesa.estado_actual = 'LIBRE'

      this.gestionMesasService.save(mesa).subscribe({
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
    const mesaEditada: MesaDto = this.formulario.value;

    this.gestionMesasService.edit(mesaEditada, this.itemId).subscribe({
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
        this.gestionMesasService.delete(itemId).subscribe({
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
      this.gestionMesasService.findById(itemId).subscribe({
        next: (data) => {
          this.formulario.patchValue({
            numero: data.numero,
            capacidad: data.capacidad,
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
    this.gestionMesasService.getAll().subscribe({
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
      (item) => item.numero.toLowerCase().includes(this.searchText.toLowerCase()) || item.capacidad.toString() == this.searchText
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
