import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { InventarioDto } from "src/app/dtos/configuracion/inventario/inventario.dto";
import { GestionInventarioApiConstant } from "src/app/constant/configuracion/inventario/gestion-inventario-api.constant";


@Injectable({
    providedIn: 'root'
})
export class GestionInventarioService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<InventarioDto>> {
        return this.http.get<Array<InventarioDto>>(GestionInventarioApiConstant.URL_GET_ALL);
    }

    public save(request: InventarioDto): Observable<any> {
        return this.http.post(GestionInventarioApiConstant.URL_SAVE, request);
    }

    public edit(request: InventarioDto, itemId: number): Observable<any> {
        return this.http.put(`${GestionInventarioApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionInventarioApiConstant.URL_DELETE}/${itemId}`);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionInventarioApiConstant.URL_FIND_BY_ID + itemId}`);
    }


}
