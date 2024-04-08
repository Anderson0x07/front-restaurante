import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RolDto } from "src/app/dtos/configuracion/usuario/rol.dto";
import { GestionRolApiConstant } from "src/app/constant/configuracion/rol/gestion-rol-api.constant";


@Injectable({
    providedIn: 'root'
})
export class GestionRolesService {

    constructor(
        private http: HttpClient
    ) { }

    public getAll(): Observable<Array<RolDto>> {
        return this.http.get<Array<RolDto>>(GestionRolApiConstant.URL_GET_ALL);
    }

}
