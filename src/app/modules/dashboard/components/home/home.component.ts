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
          console.log(data)
          this.estadisticas = data;
        }
      })
  }

  constructor(
    private gestionEstadisticasService: GestionEstadisticasService
  ) { }

  public estadisticas!: EstadisticaDto 

  public url = url

}
