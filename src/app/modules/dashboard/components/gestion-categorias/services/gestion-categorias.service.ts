import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionCategoriasApiConstant } from "src/app/constant/categoria/gestion-categorias-api.constant";
import { CategoriaDto } from "src/app/dtos/categoria/categoria.dto";


@Injectable({
    providedIn: 'root'
})
export class GestionCategoriasService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<CategoriaDto>> {
        return this.http.get<Array<CategoriaDto>>(GestionCategoriasApiConstant.URL_GET_ALL);
    }

    public save(request: CategoriaDto): Observable<any> {
        return this.http.post(GestionCategoriasApiConstant.URL_SAVE, request);
    }

    public edit(request: CategoriaDto, itemId: number): Observable<any> {
        return this.http.put(`${GestionCategoriasApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public delete(itemId: number): Observable<any> {
        return this.http.delete(`${GestionCategoriasApiConstant.URL_DELETE}/${itemId}`);
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionCategoriasApiConstant.URL_FIND_BY_ID + itemId}`);
    }


}
