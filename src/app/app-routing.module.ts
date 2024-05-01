import { Routes } from '@angular/router';
import { AdministradorGuard, AutenticacionGuard, MeseroGuard } from './auth-guard/autenticacion.guard';
import { AppLayoutComponent } from './modules/layout/app.layout.component';
import { MiPerfilComponent } from './modules/dashboard/components/mi-perfil/mi-perfil.component';


export const ROUTES: Routes = [
    {
      path: 'login',
      canActivate: [AutenticacionGuard],
      loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
    },
    {
      path: 'admin', component: AppLayoutComponent,
      canActivate: [AutenticacionGuard, AdministradorGuard],
      children: [
        { path: '', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      ]
    },
    {
      path: 'mesero', component: AppLayoutComponent,
      canActivate: [AutenticacionGuard, MeseroGuard],
      children: [
        { path: '', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      ]
    },
    {
      path: 'error',
      loadChildren: () => import('./modules/page-error/page-error.module').then(m => m.PageErrorModule)
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: '**',
      redirectTo: 'error',
      pathMatch: 'full'
    }
  ];