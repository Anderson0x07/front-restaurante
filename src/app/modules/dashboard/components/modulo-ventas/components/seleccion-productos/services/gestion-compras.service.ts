import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionComprasApiConstant } from "src/app/constant/ventas/compra/gestion-compras-api.constant";
import { CompraDto } from "src/app/dtos/ventas/compra/compra.dto";


@Injectable({
    providedIn: 'root'
})
export class GestionComprasService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<CompraDto>> {
        return this.http.get<Array<CompraDto>>(GestionComprasApiConstant.URL_GET_ALL);
    }

    public save(request: CompraDto): Observable<any> {
        return this.http.post(GestionComprasApiConstant.URL_SAVE, request);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionComprasApiConstant.URL_FIND_BY_ID + itemId}`);
    }

    public edit(request: CompraDto, itemId: number): Observable<any> {
        return this.http.put(`${GestionComprasApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionComprasApiConstant.URL_DELETE}/${itemId}`);
    }

    public listarComprasByFecha(fecha: string): Observable<Array<CompraDto>> {
        return this.http.get<Array<CompraDto>>(`${GestionComprasApiConstant.URL_LISTAR_COMPRAS_BY_FECHA}/${fecha}`);
    }

    public listarComprasByRangoFecha(fechaInicio: string, fechaFin: string): Observable<Array<CompraDto>> {
        return this.http.get<Array<CompraDto>>(`${GestionComprasApiConstant.URL_LISTAR_COMPRAS_BY_RANGO_FECHAS}/${fechaInicio}/${fechaFin}`);
    }

    public getCompraActualMesa(mesaId: number): Observable<CompraDto> {
        return this.http.get<CompraDto>(`${GestionComprasApiConstant.URL_COMPRA_ACTUAL_MESA}/${mesaId}`);
    }

    public propinaCompraPorcentaje(compraId: number, propinaPorcentaje: number): Observable<CompraDto> {
        return this.http.put<CompraDto>(`${GestionComprasApiConstant.URL_PROPINA_COMPRA}/porcentaje/${compraId}/${propinaPorcentaje}`, {});
    }

    public propinaCompra(compraId: number, propina: number): Observable<CompraDto> {
        return this.http.put<CompraDto>(`${GestionComprasApiConstant.URL_PROPINA_COMPRA}/${compraId}/${propina}`, {});
    }

    public imprimir(compraDto: CompraDto, clienteDomi: any): Observable<any> {

        let clienteDomicilio = null;

        if(clienteDomi != null) {
            clienteDomicilio = {
                documento: clienteDomi.documetno,
                telefono: clienteDomi.telefono,
                direccion: clienteDomi.direccion
            }
        }

        const body = {
            cliente: clienteDomicilio,
            id_compra: compraDto.id_compra,
            mesero: {
                id_usuario: compraDto.mesero.id_usuario,
                nombre: compraDto.mesero.nombre,
                apellido: compraDto.mesero.apellido,
                documento: compraDto.mesero.documento
            },
            mesa: {
                id_mesa: compraDto.mesa.id_mesa,
                numero: compraDto.mesa.numero
            },
            fecha_compra: compraDto.fecha_compra,
            total: compraDto.total,
            propina: compraDto.propina,
            pedidos: compraDto.pedidos
        }
        
        return this.http.post<any>("http://localhost:8000/print", body)
    }

    public enviarReporteDiario(): Observable<any> {
        return this.http.get(GestionComprasApiConstant.URL_EXPORT_REPORTE_DIARIO, { responseType: 'blob' });
    }

    public enviarReporteFechaInicioFechaFin(request: any): Observable<any> {
        return this.http.post(GestionComprasApiConstant.URL_EXPORT_REPORTE_DIARIO, request);
    }
}
