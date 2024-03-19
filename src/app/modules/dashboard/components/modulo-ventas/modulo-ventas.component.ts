import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MesaDto } from 'src/app/dtos/mesa/mesa.dto';

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


    public gestionMesaSeleccionada(mesaSeleccionada: MesaDto): void {
      console.log("Mesa seleccionada ", mesaSeleccionada );
      this.mesaSeleccionada = mesaSeleccionada;
      this.mostrarSeleccionProductos = true;
    }

}
