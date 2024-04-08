import { environment } from "./environment";

export class LoginApiConstant {

    static readonly URL_LOGIN: string = 
    environment.local + 
    'login';

    static readonly URL_REGISTRO: string = 
    environment.local + 
    'registro';

    static readonly URL_GET_USER: string =
    environment.local +
    'usuario'

    static readonly URL_ENVIAR_TOKEN: string = 
    environment.local + 
    'usuario/restablecer-password';

    static readonly URL_CAMBIO_PASSWORD: string = 
    environment.local + 
    'usuario/verificar-token';

    
    
}