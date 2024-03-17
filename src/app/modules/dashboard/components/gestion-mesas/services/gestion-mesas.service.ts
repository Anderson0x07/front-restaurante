import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionMesasApiConstant } from "src/app/constant/mesa/gestion-mesas-api.constant";
import { MesaDto } from "src/app/dtos/mesa/mesa.dto";


@Injectable({
    providedIn: 'root'
})
export class GestionMesasService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<MesaDto>> {
        return this.http.get<Array<MesaDto>>(GestionMesasApiConstant.URL_GET_ALL);
    }

    public save(request: MesaDto): Observable<any> {
        return this.http.post(GestionMesasApiConstant.URL_SAVE, request);
    }

    public edit(request: MesaDto, itemId: number): Observable<any> {
        return this.http.put(`${GestionMesasApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionMesasApiConstant.URL_DELETE}/${itemId}`);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionMesasApiConstant.URL_FIND_BY_ID + itemId}`);
    }


}
