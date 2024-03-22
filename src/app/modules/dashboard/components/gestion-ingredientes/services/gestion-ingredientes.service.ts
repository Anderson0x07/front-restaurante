import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionIngredientesApiConstant } from "src/app/constant/ingredientes/gestion-productos-api.constant";
import { IngredienteDto } from "src/app/dtos/ingrediente/ingrediente.dto";


@Injectable({
    providedIn: 'root'
})
export class GestionIngredientesService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<IngredienteDto>> {
        return this.http.get<Array<IngredienteDto>>(GestionIngredientesApiConstant.URL_GET_ALL);
    }

    public save(request: IngredienteDto): Observable<any> {
        return this.http.post(GestionIngredientesApiConstant.URL_SAVE, request);
    }

    public edit(request: IngredienteDto, itemId: number): Observable<any> {
        return this.http.put(`${GestionIngredientesApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionIngredientesApiConstant.URL_DELETE}/${itemId}`);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionIngredientesApiConstant.URL_FIND_BY_ID + itemId}`);
    }


}
