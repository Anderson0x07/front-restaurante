import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { UsuarioDTO } from "src/app/dtos/configuracion/usuario/usuario.dto";
import { GestionUsuarioApiConstant } from "src/app/constant/configuracion/usuario/gestion-usuario-api.constant";


@Injectable({
    providedIn: 'root'
})
export class GestionUsuariosService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<UsuarioDTO>> {
        return this.http.get<Array<UsuarioDTO>>(GestionUsuarioApiConstant.URL_GET_ALL);
    }

    public save(request: UsuarioDTO): Observable<any> {
        return this.http.post(GestionUsuarioApiConstant.URL_SAVE, request);
    }

    public edit(request: UsuarioDTO, itemId: number): Observable<any> {
        return this.http.put(`${GestionUsuarioApiConstant.URL_EDIT}/${itemId}`, request);
    }

    public editState(itemId: number): Observable<any> {
        return this.http.put(`${GestionUsuarioApiConstant.URL_EDITAR_ESTADO}/${itemId}`, {});
    }

    public findById(itemId: number): Observable<any> {
        return this.http.get<any>(`${GestionUsuarioApiConstant.URL_FIND_BY_ID + itemId}`);
    }


}
