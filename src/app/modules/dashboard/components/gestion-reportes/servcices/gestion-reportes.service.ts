import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { GestionReportesApiConstant } from "src/app/constant/configuracion/reporte/gestion-reportes-api.constant";


@Injectable({
    providedIn: 'root'
})
export class GestionReportesService {

    constructor(
        private http: HttpClient
    ) { }

    public enviarReporteDiario(): Observable<any> {
        return this.http.get(GestionReportesApiConstant.URL_SEND_REPORT);
    }

    public enviarReporteFecha(fecha: string): Observable<any> {
        return this.http.get(`${GestionReportesApiConstant.URL_SEND_REPORT}/${fecha}`);
    }
}
