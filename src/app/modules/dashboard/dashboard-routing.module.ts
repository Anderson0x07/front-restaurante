import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionMesasComponent } from './components/gestion-mesas/gestion-mesas.component';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: HomeComponent },
            { path: 'ventas', loadChildren: () => import('./components/modulo-ventas/modulo-ventas.module').then(m => m.ModuloVentasModule) },
            { path: 'mesas', component: GestionMesasComponent },
            { path: 'categorias', component: GestionCategoriasComponent },
            { path: 'productos', component: GestionProductosComponent },
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
