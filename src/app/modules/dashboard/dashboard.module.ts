import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardsRoutingModule } from './dashboard-routing.module';
import { HomeComponent } from './components/home/home.component';
import { GestionMesasComponent } from './components/gestion-mesas/gestion-mesas.component';
import { SharedModule } from '../shared/shared.module';
import { GestionCategoriasComponent } from './components/gestion-categorias/gestion-categorias.component';
import { GestionProductosComponent } from './components/gestion-productos/gestion-productos.component';
import { GestionIngredientesComponent } from './components/gestion-ingredientes/gestion-ingredientes.component';
import { GestionInventarioComponent } from './components/gestion-inventario/gestion-inventario.component';

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
        GestionProductosComponent,
        GestionIngredientesComponent,
        GestionInventarioComponent
    ]
})
export class DashboardModule { }
