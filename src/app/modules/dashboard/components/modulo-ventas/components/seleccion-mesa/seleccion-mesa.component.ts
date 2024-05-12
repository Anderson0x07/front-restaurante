import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GestionMesasService } from '../../../gestion-mesas/services/gestion-mesas.service';
import { MesaDto } from 'src/app/dtos/configuracion/mesa/mesa.dto';
import { UsuarioDTO } from 'src/app/dtos/configuracion/usuario/usuario.dto';

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

        const auth: UsuarioDTO = JSON.parse(localStorage.getItem("USUARIO")+'')

        this.mesas = data.filter(item => item.estado && !item.numero.toLowerCase().includes('domi') || auth.rol.nombre === 'ADMINISTRADOR');

        this.mesas.sort((a, b) => {
            const includesDomiA = a.numero.toLowerCase().includes('domi');
            const includesDomiB = b.numero.toLowerCase().includes('domi');

            if (includesDomiA && !includesDomiB) {
                return -1;
            } else if (!includesDomiA && includesDomiB) {
                return 1;
            }

            return a.numero.localeCompare(b.numero);
          });

      }
    });

  }

  getSeverity(mesa: MesaDto): string {
    switch (mesa.estado_actual) {
      case 'LIBRE':
        return 'success';

      case 'OCUPADO':
        return 'danger';

      case 'FACTURADO':
        return 'warning';

      default:
        return 'success';
    }
  };

  onSeleccionMesa(mesaSeleccionada: MesaDto): void {
    localStorage.removeItem('carritoCompras');
    this.seleccionMesa.emit(mesaSeleccionada)
  }

}
