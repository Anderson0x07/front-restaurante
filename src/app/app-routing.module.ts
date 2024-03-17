import { Routes } from '@angular/router';
import { AutenticacionGuard } from './auth-guard/autenticacion.guard';
import { AppLayoutComponent } from './modules/layout/app.layout.component';


export const ROUTES: Routes = [
    {
      path: 'login',
      canActivate: [AutenticacionGuard],
      loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
    },
    {
      path: 'admin', component: AppLayoutComponent,
      canActivate: [AutenticacionGuard],
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