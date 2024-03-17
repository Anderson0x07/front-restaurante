import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AutenticacionResponseDTO } from '../dtos/login/autenticacion-response.dto';

/**
 * Se utiliza para los routers principales, donde se requiere
 * estar autenticado para poder acceder a los Modulos del negocio
 */
@Injectable()
export class AutenticacionGuard implements CanActivate {

  /**
   * @param router, se utiliza para el redireccionamiento si
   * surge algun error en el filtro
   */
  constructor(private router: Router) {}

  /**
   * Metodo que permite validar si el usuario ya se encuentra autenticado
   * para los routers que esten senialado para este filtro
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let valido = true;

    // se obtiene la URL de la pagina destino
    const url = state.url;

    // DTO que contiene los datos de la autenticacion
    let auth: AutenticacionResponseDTO = JSON.parse(localStorage.getItem('AUTH')+'');
    // dependiendo del estado de la autenticacion se hace el llamado a los metodos
    if (auth && auth.username && auth.token) {
      valido = this.canActivateUserLogin(url);
    } else {
        valido = this.canActivateUserNoLogin(url);
    }
    
    return valido;
  }

  /**
   * Cuando el usuario esta autenticado la URL NO puede ser
   * LOGIN, si la URL es LOGIN se redirecciona a la pagina
   * de bienvenida.
   */
  private canActivateUserLogin(url: string): boolean {
    if (url.includes('login')) {
      return this.goTo('/admin/dashboard');
    }
    return true;
  }

  /**
   * Cuando el usuario NO esta autenticado la URL debe ser
   * LOGIN, si la URL no es LOGIN se redirecciona a la pagina
   * de INICIO DE SESION.
   */
  private canActivateUserNoLogin(url: string): boolean {
    if (!url.includes('login')) {
      return this.goTo('/login');
    }
    return true;
  }

  /**
   * Metodo  que permite ir a un router especifico cuando surge
   * algun error en la seguridad del router
   */
  private goTo(url: string): boolean {
    this.router.navigate([url]);
    return false;
  }
}
