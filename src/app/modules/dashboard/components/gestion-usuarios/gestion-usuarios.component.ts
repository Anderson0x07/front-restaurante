import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GestionUsuariosService } from './services/gestion-usuarios.service';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioDTO } from 'src/app/dtos/configuracion/usuario/usuario.dto';
import { RolDto } from 'src/app/dtos/configuracion/usuario/rol.dto';
import { GestionRolesService } from '../gestion-roles/services/gestion-roles.service';
import { url } from 'src/app/modules/shared/utils/Utils';


@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  providers: [CommonModule, GestionUsuariosService, ConfirmationService, MessageService]
})
export class GestionUsuariosComponent implements OnInit {

  constructor(
    private gestionUsuariosService: GestionUsuariosService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private gestionRolesService: GestionRolesService
  ) {}

  public url = url;

  @ViewChild('examinarInput') examinarInput?: ElementRef<HTMLInputElement>;

  public visible = false;
  public itemId: number = -1;
  public header = '';

  public registros: UsuarioDTO[] = [];
  public listaFiltro: UsuarioDTO[] = [];

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;

  previewUrl!: any;

  imagenSeleccionada: string = '';
  fileName: string = '';

  public roles: SelectItem[] = [];

  public rolesCargados: boolean = false;


  
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
    this.gestionUsuariosService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
      },
    });

    this.gestionRolesService.getAll().subscribe({
      next: (data) => {
        data.forEach((item: RolDto) => {
          const categoria: SelectItem = { label: item.nombre, value: item.id_rol }
          this.roles.push(categoria)
        })
      },
      complete: () => {
        this.rolesCargados = true;
      }
    })
  }


  private validarPassword() {
    return this.itemId == -1 ? Validators.required : null
  }


  private initForm(): void {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      telefono: ['', Validators.required],
      estado: true,
      email: ['', Validators.required],
      password: [{value: ''}, this.validarPassword()],
      rol: ['', Validators.required]
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

      const usuario: UsuarioDTO = {
        nombre: formValue.nombre,
        apellido: formValue.apellido,
        documento: formValue.documento,
        telefono: formValue.telefono,
        estado: formValue.estado,
        email: formValue.email,
        password: formValue.password,
        imagen: "",
        rol: {
          id_rol: formValue.rol
        }
      }

      if (this.imagenSeleccionada != "") {
        usuario.imagen = this.imagenSeleccionada + " " + this.fileName;
      }

      this.gestionUsuariosService.save(usuario).subscribe({
        next: (res: {message: string}) => {
          this.visible = false;
          this.listar();
          this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: res.message, life: 3000 });
        },
        error: (err: HttpErrorResponse) => {
          console.log(err)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.error, life: 3000 });
        },
      });
  }

  public editar() {

    const formValue = this.formulario.value;

    const usuarioEditado: UsuarioDTO = {
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      documento: formValue.documento,
      telefono: formValue.telefono,
      estado: formValue.estado,
      email: formValue.email,
      rol: {
        id_rol: formValue.rol
      }
    }

    usuarioEditado.imagen = this.imagenSeleccionada;

    if (!this.imagenSeleccionada.includes('http')) {
      usuarioEditado.imagen = this.imagenSeleccionada + " " + this.fileName;
    } else {
      usuarioEditado.imagen = "";
    }

    console.log(usuarioEditado.imagen)
    this.gestionUsuariosService.edit(usuarioEditado, this.itemId).subscribe({
      next: (data: {message: string}) => {
        this.visible = false;
        this.listar();
        this.messageService.add({ severity: 'success', summary: 'Éxitoso', detail: data.message, life: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.error.errors.join(''), life: 3000 });
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
        this.gestionUsuariosService.delete(itemId).subscribe({
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
      this.gestionUsuariosService.findById(itemId).subscribe({
        next: (data) => {
          this.imagenSeleccionada = this.url + data.imagen;
          this.previewUrl = this.url + data.imagen;
          this.formulario.patchValue({
            nombre: data.nombre,
            apellido: data.apellido,
            documento: data.documento,
            telefono: data.telefono,
            estado: data.estado,
            email: data.email,
            rol: data.rol.id_rol
          });
        },
        error: (err: {message: string}) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
        }
      });
    }
  }

  public listar() {
    this.gestionUsuariosService.getAll().subscribe({
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
        item.apellido.toLowerCase() == this.searchText || 
        item.documento.toLowerCase() == this.searchText ||
        item.telefono.toLowerCase() == this.searchText ||
        item.email.toLowerCase() == this.searchText
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
