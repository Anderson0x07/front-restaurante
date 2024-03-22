import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ProductoDto } from "src/app/dtos/configuracion/producto/producto.dto";
import { GestionProductosApiConstant } from "src/app/constant/configuracion/producto/gestion-productos-api.constant";


@Injectable({
    providedIn: 'root'
})
export class GestionProductosService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<ProductoDto>> {
        return this.http.get<Array<ProductoDto>>(GestionProductosApiConstant.URL_GET_ALL);
    }

    public save(request: ProductoDto): Observable<any> {
        return this.http.post(GestionProductosApiConstant.URL_SAVE, request);
    }

    public edit(request: ProductoDto, itemId: number): Observable<any> {
        return this.http.put(`${GestionProductosApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionProductosApiConstant.URL_DELETE}/${itemId}`);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionProductosApiConstant.URL_FIND_BY_ID + itemId}`);
    }


}
