import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionMesasComponent } from './components/gestion-mesas/gestion-mesas.component';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { GestionIngredientesComponent } from './components/gestion-ingredientes/gestion-ingredientes.component';
import { GestionInventarioComponent } from './components/gestion-inventario/gestion-inventario.component';
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: HomeComponent },
            { path: 'ventas', loadChildren: () => import('./components/modulo-ventas/modulo-ventas.module').then(m => m.ModuloVentasModule) },
            { path: 'mesas', component: GestionMesasComponent },
            { path: 'categorias', component: GestionCategoriasComponent },
            { path: 'productos', component: GestionProductosComponent },
            { path: 'ingredientes', component: GestionIngredientesComponent },
            { path: 'inventario', component: GestionInventarioComponent },
            { path: 'usuarios', component: GestionUsuariosComponent },
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
