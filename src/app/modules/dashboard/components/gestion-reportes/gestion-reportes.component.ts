import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CompraDto } from 'src/app/dtos/ventas/compra/compra.dto';
import { GestionComprasService } from '../modulo-ventas/components/seleccion-productos/services/gestion-compras.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GestionReportesService } from './servcices/gestion-reportes.service';
import { DatePipe } from '@angular/common';
import { url } from 'src/app/modules/shared/utils/Utils';


@Component({
  selector: 'app-gestion-reportes',
  templateUrl: './gestion-reportes.component.html',
  providers: [GestionComprasService, ConfirmationService, MessageService, DatePipe]

})
export class GestionReportesComponent implements OnInit {

  constructor(
    private gestionComprasService: GestionComprasService,
    private gestionReportesService: GestionReportesService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    public datePipe: DatePipe

  ) { }

  public visibleDetalleCompra = false;
  public itemId: number = -1;
  public header = '';

  public registros: CompraDto[] = [];
  public listaFiltro: CompraDto[] = [];

  public detalleCompra: CompraDto | any;

  public formulario!: FormGroup;

  public searchText: string = '';
  public first: number = 0;
  public rows: number = 10;
  
  public url = url;


  ngOnInit(): void {
    this.gestionComprasService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });
      },
    });
  }

  public listar() {
    this.gestionComprasService.getAll().subscribe({
      next: (data) => {
        this.registros = data;
        this.listaFiltro = data;
      },
      error: (err: { message: string }) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.message, life: 3000 });
      }
    });
  }


  public search() {
    
    this.listaFiltro = this.registros.filter(
      (item) => item.fecha_compra.toString().includes(this.searchText) || item.hora.includes(this.searchText) ||
        item.mesa.numero.toLowerCase().includes(this.searchText.toLowerCase()) ||
        (item.total + item.propina).toString().includes(this.searchText) ||
        item.propina.toString().includes(this.searchText) ||
        item.mesero.nombre.toString().includes(this.searchText) 
    );
  }

  public verDetalle(item: CompraDto) {
    this.visibleDetalleCompra = true;
    
    this.gestionComprasService.findById(item.id_compra).subscribe({
      next: (data) => {
        this.detalleCompra = data;
      },
      error: (err) => {
        this.messageService.add({ key: 'reporte', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });

      }
    })
  }

  public enviarReporteDiario(): void {
    this.gestionReportesService.enviarReporteDiario().subscribe({
      next: (data) => {
        console.log(data)
        this.messageService.add({ key: 'reporte', severity: 'success', summary: 'Éxitoso', detail: 'Reporte enviado satisfactoriamente.', life: 3000 });

      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
        this.messageService.add({ key: 'reporte', severity: 'error', summary: 'Error', detail: 'No se puede enviar el reporte de ventas, no hay ventas el dia de hoy.', life: 3000 });

      }
    })
  }

  public fecha!: Date;

  public enviarReporteFecha(): void {

    const fechaFormat: any = this.datePipe.transform(this.fecha, "YYYY-MM-dd");

    this.gestionReportesService.enviarReporteFecha(fechaFormat).subscribe({
      next: (data) => {
        console.log(data)
        this.messageService.add({ key: 'reporte', severity: 'success', summary: 'Éxitoso', detail: 'Reporte enviado satisfactoriamente.', life: 3000 });
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({ key: 'reporte', severity: 'error', summary: 'Error', detail: 'No se puede enviar el reporte de ventas, no hay ventas el dia de hoy.', life: 3000 });

      }
    })
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
