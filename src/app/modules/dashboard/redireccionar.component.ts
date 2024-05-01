import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionResponseDTO } from 'src/app/dtos/login/autenticacion-response.dto';

@Component({
  selector: 'app-redirect',
  template: '<p>Redireccionando...</p>',
})
export class RedirectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {

    let auth: AutenticacionResponseDTO = JSON.parse(localStorage.getItem('AUTH')+'');
    
    if (auth.rol == 'ROLE_ADMINISTRADOR') {
      this.router.navigate(['/admin/dashboard']);
    } else if (auth.rol == 'ROLE_MESERO') {
      this.router.navigate(['/mesero/ventas']);
    } else {
      this.router.navigate(['/error']);
    }
  }
}