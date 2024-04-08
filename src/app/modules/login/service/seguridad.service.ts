import { Injectable } from "@angular/core";
import { Observable} from "rxjs";
import { AutenticacionRequestDTO } from "src/app/dtos/login/autenticacion-request.dto";
import { HttpClient } from "@angular/common/http";
import { AutenticacionResponseDTO } from "src/app/dtos/login/autenticacion-response.dto";
import { LoginApiConstant } from "src/app/constant/login-api.constant";
import { UsuarioDTO } from "src/app/dtos/configuracion/usuario/usuario.dto";


@Injectable({
    providedIn: 'root'
})
export class SeguridadService {

    /**
     * @param http para hacer las peticiones a los servicios REST
     */
    constructor(private http: HttpClient) { }

    public login(credenciales: AutenticacionRequestDTO): Observable<AutenticacionResponseDTO> {
        return this.http.post<AutenticacionResponseDTO>(LoginApiConstant.URL_LOGIN, credenciales);
    }

    public enviarToken(email: string): Observable<any> {
        return this.http.post<any>(`${LoginApiConstant.URL_ENVIAR_TOKEN}/${email}`, null);
    }

    public cambiarPassword(token: string, newPassword: string): Observable<any> {
        return this.http.post<any>(LoginApiConstant.URL_CAMBIO_PASSWORD, { token, newPassword });
    }

    public getUser(email: string): Observable<UsuarioDTO> {
        return this.http.get<UsuarioDTO>(`${LoginApiConstant.URL_GET_USER}/email/${email}`)
    }


}
