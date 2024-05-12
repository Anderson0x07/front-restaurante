import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeguridadService } from './service/seguridad.service';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private seguridadService: SeguridadService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  loginForm!: FormGroup;
  cambioPasswordForm!: FormGroup;

  emailConsultado: string = "";
  tokenEnviado: boolean = false;


  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.cambioPasswordForm = this.fb.group({
      email: [''],
      password: ['', Validators.required],
      token: ['', Validators.required]
    })
  }

  public onLogin() {

    if (this.loginForm.valid) {

      this.seguridadService.login(this.loginForm.value).subscribe({
        next: (data) => {
          localStorage.setItem('AUTH', JSON.stringify(data))

          if(data.rol == 'ROLE_ADMINISTRADOR') {
            this.router.navigate(['admin']);
          } else {
            this.router.navigate(['mesero'])
          }
        },
        error: ({ error: { message } }: HttpErrorResponse) => {
          this.messageService.clear();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: message });

        }
      })
    }
  }

  public cambioPassword = false;

  public handleChangePassword() {
    this.messageService.clear();
    this.cambioPassword = true;

  }

  public enviarCodigo() {

    const email = this.cambioPasswordForm.get('email')?.value;

    if (this.validateEmail(email)) {

      this.seguridadService.enviarToken(email).subscribe({
        next: (data) => {
          this.tokenEnviado = true;
          this.activeIndex++;

        },
        error: ({ error }: HttpErrorResponse) => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });

        }
      })
    }

  }

  public isValidField(field: string): boolean | null {
    return (
      (field == 'email' && !this.validateEmail(this.cambioPasswordForm.controls[field].value)) &&
      this.cambioPasswordForm.controls[field].errors &&
      this.cambioPasswordForm.controls[field].touched
    );
  }

  validateEmail(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  }

  public cambiarPassword() {

    const token = this.cambioPasswordForm.get('token')?.value;
    const newPassword = this.cambioPasswordForm.get('password')?.value;

    this.seguridadService.cambiarPassword(token, newPassword).subscribe({
      next: () => {
        this.activeIndex++;
      },
      error: ({ error }: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error });

      }
    })
  }


  items: MenuItem[] = Array(3).fill({});

  activeIndex: number = 0;

  next() {
    this.messageService.clear();

    if (this.activeIndex < this.items.length) {
      if (this.activeIndex == 0) {
        this.enviarCodigo();
      } else if (this.activeIndex == 1 && this.tokenEnviado) {
        this.cambiarPassword();

      } else if(this.activeIndex == 2) {
        this.cambioPassword = false
      }
    }

  }

  public getInfo(): { titulo: string, descripcion: string, labelButton: string } {

    let info = {
      titulo: '',
      descripcion: '',
      labelButton: ''
    }

    switch (this.activeIndex) {
      case 0:
        info = {
          titulo: 'Identifica tu cuenta',
          descripcion: '¿A qué cuenta tienes problemas para acceder?',
          labelButton: 'Continuar'
        }
        break
      case 1:
        info = {
          titulo: 'Comprobación de seguridad',
          descripcion: 'Introduce el código de verificación enviado a: ' + this.cambioPasswordForm.get('email')?.value,
          labelButton: 'Cambiar contraseña'
        }
        break;
      case 2:
        info = {
          titulo: 'Exitoso',
          descripcion: 'Contraseña actualizada correctamente',
          labelButton: 'Volver'
        }
        break;
    }

    return info;
  }

  public loginValido(): boolean {
    return this.validateEmail(this.loginForm.get('email')?.value) && this.loginForm.get('password')?.value
  }


}
