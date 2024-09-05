import { Component, OnInit } from '@angular/core';
import { GestionEstadisticasService } from './services/gestion-estadisticas.service';
import { EstadisticaDto } from 'src/app/dtos/configuracion/estadistica/estadistica.dto';
import { url } from 'src/app/modules/shared/utils/Utils';
import { ProductoDto } from 'src/app/dtos/configuracion/producto/producto.dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  ngOnInit(): void {

    this.gestionEstadisticasService.getStats().subscribe({
      next: (data) => {
        this.estadisticas = data;
      },
      error: (err) => {
        this.error = "No hay información disponible"
      }
    });
    
    const usuario = localStorage.getItem('USUARIO');

    if(usuario) {
      const nombreUsuario = JSON.parse(usuario).nombre;
      this.nombreUsuario = nombreUsuario;
    }

    const hora = new Date().getHours();

    if (hora >= 0 && hora < 12) {
      this.saludo = 'Buenos días';
    } else if (hora >= 12 && hora < 18) {
      this.saludo = 'Buenas tardes';
    } else {
      this.saludo = 'Buenas noches';
    }

  }

  constructor(
    private gestionEstadisticasService: GestionEstadisticasService
  ) { }

  public estadisticas!: EstadisticaDto 
  public error!: string;
  public url = url

  public saludo: string = "";
  public nombreUsuario: string = "";

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

}
