import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GestionMesasService } from '../../../gestion-mesas/services/gestion-mesas.service';
import { MesaDto } from 'src/app/dtos/configuracion/mesa/mesa.dto';

@Component({
  selector: 'app-seleccion-mesa',
  templateUrl: './seleccion-mesa.component.html'
})
export class SeleccionMesaComponent implements OnInit {

  @Output() public seleccionMesa = new EventEmitter<MesaDto>();
  

  mesas!: MesaDto[];

  constructor(
    private gestionMesasService: GestionMesasService,
  ) { }

  ngOnInit() {
    this.gestionMesasService.getAll().subscribe({
      next: (data) => {
        this.mesas = data.filter(item => item.estado)
      }
    });

  }

  getSeverity(mesa: MesaDto): string {
    switch (mesa.estado_actual) {
      case 'LIBRE':
        return 'success';

      case 'OCUPADO':
        return 'danger';
      default:
        return 'success';
    }
  };

  onSeleccionMesa(mesaSeleccionada: MesaDto): void {
    this.seleccionMesa.emit(mesaSeleccionada)
  }

}
