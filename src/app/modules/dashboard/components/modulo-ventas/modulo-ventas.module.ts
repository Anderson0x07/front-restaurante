import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ModuloVentasComponent } from './modulo-ventas.component';
import { RouterModule } from '@angular/router';
import { SeleccionMesaComponent } from './components/seleccion-mesa/seleccion-mesa.component';
import { SeleccionProductosComponent } from './components/seleccion-productos/seleccion-productos.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule.forChild([
            { path: '', component: ModuloVentasComponent },
        ])

    ],
    declarations: [
        ModuloVentasComponent,
        SeleccionMesaComponent,
        SeleccionProductosComponent
    ]
})
export class ModuloVentasModule { }