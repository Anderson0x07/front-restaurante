import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from "./service/app.layout.service";
import { AppSidebarComponent } from "./components/sidebar/app.sidebar.component";
import { AppTopBarComponent } from './components/topbar/app.topbar.component';
import { UsuarioDTO } from 'src/app/dtos/configuracion/usuario/usuario.dto';
import { SeguridadService } from '../login/service/seguridad.service';
import { AutenticacionResponseDTO } from 'src/app/dtos/login/autenticacion-response.dto';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-layout',
    templateUrl: './app.layout.component.html',
    providers: [MessageService]
})
export class AppLayoutComponent implements OnInit {

    public modulos: Array<any> = [
        {
            label: 'Administración',
            items: [
                {
                    label: 'Inicio',
                    routerLink: '/admin/dashboard',
                    icon: 'pi pi-home'
                },
                {
                    label: 'Ventas',
                    routerLink: '/admin/ventas',
                    icon: 'pi pi-shopping-cart'
                },
                {
                    label: 'Reportes',
                    routerLink: '/admin/reportes',
                    icon: 'pi pi-file'
                }
            ]
        },
        {
            label: 'Configuración',
            items: [
                {
                    label: 'Gestión de Mesas',
                    routerLink: '/admin/mesas',
                    icon: 'pi pi-table'
                },
                {
                    label: 'Gestión de Categorias',
                    routerLink: '/admin/categorias',
                    icon: 'pi pi-th-large'
                },
                {
                    label: 'Gestión de Productos',
                    routerLink: '/admin/productos',
                    icon: 'pi pi-truck'
                },
                {
                    label: 'Gestión de Ingredientes',
                    routerLink: '/admin/ingredientes',
                    icon: 'pi pi-slack'
                },
                {
                    label: 'Gestión de Inventario',
                    routerLink: '/admin/inventario',
                    icon: 'pi pi-server'
                },
                {
                    label: 'Gestión de Usuarios',
                    routerLink: '/admin/usuarios',
                    icon: 'pi pi-users'
                }
            ]
        }
        // Otras secciones
    ]

    public modulosMeseros: Array<any> = [
        {
            label: 'Modulos',
            items: [
                {
                    label: 'Ventas',
                    routerLink: '/mesero/ventas',
                    icon: 'pi pi-shopping-cart'
                }
            ]
        }
    ]

    usuario: UsuarioDTO = new UsuarioDTO();

    ngOnInit(): void {

        this.programarPeticionApi();

        let usuario: AutenticacionResponseDTO = JSON.parse(localStorage.getItem('AUTH') + '');
        if (usuario) {
            // CONSULTAR EL USUARIO COMPLETO DE ACUERDO AL EMAIL
            this.seguridadService.getUser(usuario.username).subscribe({
                next: (data: UsuarioDTO) => {

                    if(!data.estado) {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario inactivo', life: 3000 });
                        localStorage.clear();
                        this.router.navigate(['/login']);
                        return;
                    }

                    this.usuario = data;
                    localStorage.setItem('USUARIO', JSON.stringify(data));
                    this.gestionarMenu(data.rol.nombre);

                },
                error: () => {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error de servidor', life: 3000 });

                }
            })
        }
    }

    
    private programarPeticionApi(): void {
        const ahora = new Date();
        const horaObjetivo = new Date(ahora);
        
        horaObjetivo.setHours(23, 35, 0, 0);
        
        let diferencia = horaObjetivo.getTime() - ahora.getTime();

        console.log(diferencia)

        // Si la hora objetivo ya pasó hoy, programa para el mismo horario del día siguiente
        if (diferencia < 0) {
            diferencia += 24 * 60 * 60 * 1000; // Agregar 24 horas en milisegundos
        }

        // Programar la petición a la API
        setTimeout(() => this.hacerPeticionApi(), diferencia);
    }

    private hacerPeticionApi(): void {
        const auth = JSON.parse(localStorage.getItem('AUTH')+'');
        this.seguridadService.getUser(auth.username).subscribe(response => {
            console.log('Respuesta de la API:', response);
        });
    }

    private gestionarMenu(rol: string) {
        if (rol == 'MESERO') {
            this.modulos = this.modulosMeseros
        }
    }

    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    profileMenuOutsideClickListener: any;

    @ViewChild(AppSidebarComponent) appSidebar!: AppSidebarComponent;

    @ViewChild(AppTopBarComponent) appTopbar!: AppTopBarComponent;

    constructor(public layoutService: LayoutService, public renderer: Renderer2, public router: Router, public seguridadService: SeguridadService, private messageService: MessageService) {

        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appSidebar.el.nativeElement.isSameNode(event.target) || this.appSidebar.el.nativeElement.contains(event.target)
                        || this.appTopbar.menuButton.nativeElement.isSameNode(event.target) || this.appTopbar.menuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideMenu();
                    }
                });
            }

            if (!this.profileMenuOutsideClickListener) {
                this.profileMenuOutsideClickListener = this.renderer.listen('document', 'click', event => {
                    const isOutsideClicked = !(this.appTopbar.menu.nativeElement.isSameNode(event.target) || this.appTopbar.menu.nativeElement.contains(event.target)
                        || this.appTopbar.topbarMenuButton.nativeElement.isSameNode(event.target) || this.appTopbar.topbarMenuButton.nativeElement.contains(event.target));

                    if (isOutsideClicked) {
                        this.hideProfileMenu();
                    }
                });
            }

            if (this.layoutService.state.staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hideMenu();
                this.hideProfileMenu();
            });
    }

    hideMenu() {
        this.layoutService.state.overlayMenuActive = false;
        this.layoutService.state.staticMenuMobileActive = false;
        this.layoutService.state.menuHoverActive = false;
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    hideProfileMenu() {
        this.layoutService.state.profileSidebarVisible = false;
        if (this.profileMenuOutsideClickListener) {
            this.profileMenuOutsideClickListener();
            this.profileMenuOutsideClickListener = null;
        }
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        }
        else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        }
        else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-theme-light': this.layoutService.config().colorScheme === 'light',
            'layout-static': this.layoutService.config().menuMode === 'static',
            'layout-static-inactive': this.layoutService.state.staticMenuDesktopInactive && this.layoutService.config().menuMode === 'static',
            'layout-overlay-active': this.layoutService.state.overlayMenuActive,
            'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
            'p-ripple-disabled': !this.layoutService.config().ripple
        }
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }
}
