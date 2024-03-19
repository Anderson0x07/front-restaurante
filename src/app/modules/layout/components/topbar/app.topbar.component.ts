import { Component, ElementRef, ViewChild } from '@angular/core';
import { LayoutService } from "../../service/app.layout.service";
import { Router } from '@angular/router';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent{

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private router: Router
    ) { }

    cerrarSesion(): void {
        localStorage.clear();
        this.router.navigate(['login'])
    }

}
