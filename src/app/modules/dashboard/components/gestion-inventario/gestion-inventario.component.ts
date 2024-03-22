import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { GestionInventarioService } from './services/gestion-inventario.service';
import { InventarioDto } from 'src/app/dtos/configuracion/inventario/inventario.dto';
import { IngredienteDto } from 'src/app/dtos/configuracion/ingrediente/ingrediente.dto';
import { GestionIngredientesService } from '../gestion-ingredientes/services/gestion-ingredientes.service';


@Component({
  selector: 'app-gestion-inventario',
  templateUrl: './gestion-inventario.component.html',
  providers: [CommonModule, GestionInventarioService, ConfirmationService, MessageService]
})
export class GestionInventarioComponent implements OnInit {

  constructor(
    private gestionInventarioService: GestionInventarioService,
    private gestionIngredientesService: GestionIngredientesService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  public visible = false;
  public itemId: number = -1;
  public header = '';

  public registros: InventarioDto[] = [];
  public listaFiltro: InventarioDto[] = [];

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;

  public ingredientes: any[] = [];

  public ingredientesCargados: boolean = false;

  public ingredienteSeleccionado: string = '';

  public unidadMedidaSeleccionada: string = '';

  ngOnInit(): void {

    this.initForm();
    this.listar();
  }

  private initForm(): void {
    this.formulario = this.fb.group({
      ingrediente: ['', Validators.required],
      cantidad: ['', Validators.required],
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
      const formValue = this.formulario.value;

      const inventario: InventarioDto = new InventarioDto();

      inventario.cantidad = formValue.cantidad;
      inventario.ingrediente = {
        id_ingrediente: formValue.ingrediente
      }

      this.gestionInventarioService.save(inventario).subscribe({
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

    const formValue = this.formulario.value;

    const inventarioEditado: InventarioDto = new InventarioDto();

    inventarioEditado.cantidad = formValue.cantidad
    inventarioEditado.ingrediente = {
      id_ingrediente: formValue.ingrediente
    }

    this.gestionInventarioService.edit(inventarioEditado, this.itemId).subscribe({
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
        this.gestionInventarioService.delete(itemId).subscribe({
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
      this.gestionInventarioService.findById(itemId).subscribe({
        next: (data) => {
          this.ingredienteSeleccionado = data.ingrediente.nombre;
          this.unidadMedidaSeleccionada = data.ingrediente.unidad_medida;
          this.formulario.patchValue({
            ingrediente: data.ingrediente.id_ingrediente,
            cantidad: data.cantidad

          });
        },
        error: (err: {message: string}) => {
          this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: err.message, life: 3000 });
        }
      });
    }
  }

  public listar() {
    this.ingredientesCargados = false;
    this.ingredientes = [];
    this.unidadMedidaSeleccionada = '';
    this.ingredienteSeleccionado = '';
    this.gestionInventarioService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
      },
      complete: () => {
        this.obtenerIngredientes();
      }
    });

    
  }

  private obtenerIngredientes(): void {
    this.gestionIngredientesService.getAll().subscribe({
      next: (data) => {
        data.forEach((item: IngredienteDto) => {
          const ingredienteEnInventario = this.registros.some(inventarioItem => inventarioItem.ingrediente.id_ingrediente === item.id_ingrediente);

          if (!ingredienteEnInventario) {
            const ingrediente: any = { label: item.nombre, value: item.id_ingrediente, unidad: item.unidad_medida };
            this.ingredientes.push(ingrediente);
          }
        })
      },
      complete: () => {
        this.ingredientesCargados = true;
      }
    })
  }

  public search() {
    this.listaFiltro = this.registros.filter(
      (inventario) => inventario.ingrediente.nombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
                inventario.ingrediente.unidad_medida.toLowerCase().includes(this.searchText.toLowerCase()) ||
                inventario.cantidad.toString().toLowerCase().includes(this.searchText.toLowerCase()) ||
                inventario.fecha_ingreso.toString().toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  public seleccionarIngrediente(event: any) {
    const ingredienteSeleccionado = event.value;
    if (ingredienteSeleccionado) {
      const ingrediente = this.ingredientes.find(item => item.value === ingredienteSeleccionado);
      this.unidadMedidaSeleccionada = ingrediente?.unidad || '';
    } else {
      this.unidadMedidaSeleccionada = '';
    }
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
