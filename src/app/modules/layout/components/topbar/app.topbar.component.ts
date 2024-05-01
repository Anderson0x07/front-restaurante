import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LayoutService } from "../../service/app.layout.service";
import { Router } from '@angular/router';
import { UsuarioDTO } from 'src/app/dtos/configuracion/usuario/usuario.dto';
import { url } from 'src/app/modules/shared/utils/Utils';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @Input() usuario!: UsuarioDTO;

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) { }

    public url: string = url;

    cerrarSesion(): void {
        localStorage.clear();
        this.router.navigate(['login'])
    }

}
