import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { AutenticacionResponseDTO } from '../dtos/login/autenticacion-response.dto';
import { Router } from '@angular/router';
import { SpinnerState } from './spinner.state';

type ObjectInterceptor = {
  'Content-Type': string;
  Authorization?:  string;
}

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private spinnerState: SpinnerState, private router: Router) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerState.displaySpinner();

    let contentHeader = this.getOnlyTypeJson();
    
    return next.handle(req.clone({ setHeaders: contentHeader})).pipe(
      tap({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.spinnerState.hideSpinner();
          }
        },
        error: (err: HttpErrorResponse) => {

          if(err.status == 401 || err.status == 403) {
            localStorage.clear();
            this.router.navigate(['login']);
          }
          this.spinnerState.hideSpinner();
        }
      })
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
