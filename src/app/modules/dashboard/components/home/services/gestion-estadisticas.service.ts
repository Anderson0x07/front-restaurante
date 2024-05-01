import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionEstadisticasApiConstant } from "src/app/constant/configuracion/estadistica/gestion-estadisticas-api.constant";
import { EstadisticaDto } from "src/app/dtos/configuracion/estadistica/estadistica.dto";


@Injectable({
    providedIn: 'root'
})
export class GestionEstadisticasService {

    constructor(
        private http: HttpClient
    ) { }

    public getStats(): Observable<EstadisticaDto> {
        return this.http.get<EstadisticaDto>(GestionEstadisticasApiConstant.URL_GET_STATS);
    }

}
