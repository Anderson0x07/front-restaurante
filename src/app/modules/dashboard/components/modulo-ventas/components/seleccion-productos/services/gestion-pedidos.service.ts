import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionPedidosApiConstant } from "src/app/constant/ventas/pedido/gestion-pedidos-api.constant";
import { PedidosCompraMesaDto } from "src/app/dtos/ventas/pedido-request.dto";
import { PedidoDto } from "src/app/dtos/ventas/pedido/pedido.dto";


@Injectable({
    providedIn: 'root'
})
export class GestionPedidosService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<PedidoDto>> {
        return this.http.get<Array<PedidoDto>>(GestionPedidosApiConstant.URL_GET_ALL);
    }

    public save(request: PedidoDto): Observable<any> {
        return this.http.post(GestionPedidosApiConstant.URL_SAVE, request);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionPedidosApiConstant.URL_FIND_BY_ID + itemId}`);
    }

    public confirmarPedido(request: PedidosCompraMesaDto): Observable<any> {
        return this.http.put(`${GestionPedidosApiConstant.URL_CONFIRMAR_PEDIDO}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionPedidosApiConstant.URL_DELETE}/${itemId}`);
    }

}
