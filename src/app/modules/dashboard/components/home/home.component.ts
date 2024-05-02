import { Component, OnInit } from '@angular/core';
import { GestionEstadisticasService } from './services/gestion-estadisticas.service';
import { EstadisticaDto } from 'src/app/dtos/configuracion/estadistica/estadistica.dto';
import { url } from 'src/app/modules/shared/utils/Utils';

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

      const hora = new Date().getHours();

      if (hora >= 0 && hora < 12) {
        this.saludo = 'Buenos días';
      } else if (hora >= 12 && hora < 18) {
        this.saludo = 'Buenas tardes';
      } else {
        this.saludo = 'Buenas noches';
      }


      this.nombreUsuario = JSON.parse(localStorage.getItem('USUARIO')+'').nombre;
  }

  constructor(
    private gestionEstadisticasService: GestionEstadisticasService
  ) { }

  public estadisticas!: EstadisticaDto 
  public error!: string;
  public url = url

  public saludo: string = "";
  public nombreUsuario: string = "";

}
