import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MesaDto } from 'src/app/dtos/configuracion/mesa/mesa.dto';

@Component({
  selector: 'app-modulo-ventas',
  templateUrl: './modulo-ventas.component.html',
  providers: [MessageService]
})
export class ModuloVentasComponent implements OnInit {

    ngOnInit(): void {

    }

    public mesaSeleccionada!: MesaDto;
    public mostrarSeleccionProductos = false;

    public irVentaActual = false;


    public gestionMesaSeleccionada(mesaSeleccionada: MesaDto): void {
      this.mesaSeleccionada = mesaSeleccionada;
      this.mostrarSeleccionProductos = true;
    }

    public alSalir(evento: boolean): void {
      if(evento) {
        this.irVentaActual = false;
        this.mostrarSeleccionProductos = false;
      }
     
    }

}
