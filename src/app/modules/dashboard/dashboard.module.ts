import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './components/home/home.component';
import { GestionMesasComponent } from './components/gestion-mesas/gestion-mesas.component';
import { SharedModule } from '../shared/shared.module';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';
import { ModuloVentasComponent } from './components/modulo-ventas/modulo-ventas.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';

@NgModule({
    imports: [
        CommonModule,
        DashboardsRoutingModule,
        SharedModule
    ],
    declarations: [
        DashboardComponent,
        HomeComponent,
        GestionMesasComponent,
        GestionCategoriasComponent,
        GestionProductosComponent
    ]
})
export class DashboardModule { }
