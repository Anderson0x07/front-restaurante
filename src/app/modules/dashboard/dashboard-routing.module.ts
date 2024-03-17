import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GestionMesasComponent } from './components/gestion-mesas/gestion-mesas.component';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: HomeComponent },
            { path: 'mesas', component: GestionMesasComponent },
            { path: 'categorias', component: GestionCategoriasComponent },
        ])
    ],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
