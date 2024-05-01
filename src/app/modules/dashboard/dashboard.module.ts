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
import { GestionUsuariosComponent } from './components/gestion-usuarios/gestion-usuarios.component';
import { AcortarTextoPipe } from 'src/app/interceptors/pipe-acortar-texto.pipe';
import { RedirectComponent } from './redireccionar.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { GestionReportesComponent } from './components/gestion-reportes/gestion-reportes.component';

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
        GestionInventarioComponent,
        GestionUsuariosComponent,
        AcortarTextoPipe,
        RedirectComponent,
        MiPerfilComponent,
        GestionReportesComponent
    ]
})
export class DashboardModule { }
