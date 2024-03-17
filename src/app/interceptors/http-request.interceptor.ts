import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { AutenticacionResponseDTO } from '../dtos/login/autenticacion-response.dto';

type ObjectInterceptor = {
  'Content-Type': string;
  Authorization?:  string;
}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let contentHeader = this.getOnlyTypeJson();
    
    return next.handle(req.clone({ setHeaders: contentHeader})).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            //
          }
        },
        (err: any) => {
          //
        }
      )
    );
  }

  private getOnlyTypeJson(): any {  
    let object: ObjectInterceptor = {
      'Content-Type': 'application/json;charset=UTF-8'
    };

    const auth: AutenticacionResponseDTO = JSON.parse(localStorage.getItem('AUTH')+'')

    if (auth)  {
      object = {
        ...object, 
        'Authorization': `Bearer ${ auth.token }`
      } 
    }     
    return object;
  }
}
