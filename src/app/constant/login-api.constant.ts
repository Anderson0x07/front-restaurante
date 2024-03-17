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
}