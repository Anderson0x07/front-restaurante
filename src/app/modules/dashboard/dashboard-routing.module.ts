import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionMesasComponent } from './components/gestion-mesas/gestion-mesas.component';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { GestionIngredientesComponent } from './components/gestion-ingredientes/gestion-ingredientes.component';
import { GestionInventarioComponent } from './components/gestion-inventario/gestion-inventario.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { AdministradorGuard } from 'src/app/auth-guard/autenticacion.guard';
import { RedirectComponent } from './redireccionar.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { GestionReportesComponent } from './components/gestion-reportes/gestion-reportes.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: 'redirect', pathMatch: 'full' },
            {
                path: 'redirect',
                component: RedirectComponent
            },
            { path: 'dashboard', component: HomeComponent, canActivate: [AdministradorGuard] },
            { path: 'ventas', loadChildren: () => import('./components/modulo-ventas/modulo-ventas.module').then(m => m.ModuloVentasModule) },
            { path: 'mesas', component: GestionMesasComponent, canActivate: [AdministradorGuard] },
            { path: 'categorias', component: GestionCategoriasComponent, canActivate: [AdministradorGuard] },
            { path: 'productos', component: GestionProductosComponent, canActivate: [AdministradorGuard] },
            { path: 'ingredientes', component: GestionIngredientesComponent, canActivate: [AdministradorGuard] },
            { path: 'inventario', component: GestionInventarioComponent, canActivate: [AdministradorGuard] },
            { path: 'usuarios', component: GestionUsuariosComponent, canActivate: [AdministradorGuard] },
            { path: 'reportes', component: GestionReportesComponent, canActivate: [AdministradorGuard] },
            { path: 'mi-perfil', component: MiPerfilComponent },
            
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
