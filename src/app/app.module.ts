import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ROUTES } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { SeguridadService } from './modules/login/service/seguridad.service';
import { AutenticacionGuard } from './auth-guard/autenticacion.guard';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { CommonModule } from '@angular/common';
import { AppLayoutModule } from './modules/layout/app.layout.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(ROUTES, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' }),
    AppLayoutModule,
    ProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    },
    AutenticacionGuard,
    SeguridadService,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
