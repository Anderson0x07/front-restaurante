import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { CategoriaDto } from 'src/app/dtos/configuracion/categoria/categoria.dto';
import { MesaDto } from 'src/app/dtos/configuracion/mesa/mesa.dto';
import { GestionCategoriasService } from '../../../gestion-categorias/services/gestion-categorias.service';
import { GestionProductosService } from '../../../gestion-productos/services/gestion-productos.service';
import { ProductoDto } from 'src/app/dtos/configuracion/producto/producto.dto';
import { GestionComprasService } from './services/gestion-compras.service';
import { GestionPedidosService } from './services/gestion-pedidos.service';
import { CompraDto } from 'src/app/dtos/ventas/compra/compra.dto';
import { PedidosCompraMesaDto } from 'src/app/dtos/ventas/pedido-request.dto';
import { PedidoDto } from 'src/app/dtos/ventas/pedido/pedido.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioDTO } from 'src/app/dtos/configuracion/usuario/usuario.dto';
import { url } from 'src/app/modules/shared/utils/Utils';

@Component({
  selector: 'app-seleccion-productos',
  templateUrl: './seleccion-productos.component.html',
  providers: [ConfirmationService]
})
export class SeleccionProductosComponent implements OnInit, OnDestroy {

  constructor(
    private gestionCategoriasService: GestionCategoriasService,
    private gestionProductosService: GestionProductosService,
    private gestionComprasService: GestionComprasService,
    private gestionPedidosService: GestionPedidosService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService
  ) { }

  ngOnDestroy(): void {
    this.formPropina.reset();
  }

  @Input() mesa!: MesaDto

  public url = url;

  public categorias: SelectItem[] = [{label: 'Todos', value: 'all'}];

  public itemsPropinas: SelectItem[] = [
    { label: "1%", value: 1 },
    { label: "2%", value: 2 },
    { label: "3%", value: 3 },
    { label: "4%", value: 4 },
    { label: "5%", value: 5 },
    { label: "6%", value: 6 },
    { label: "7%", value: 7 },
    { label: "8%", value: 8 },
    { label: "9%", value: 9 },
    { label: "10%", value: 10 },
  ]

  public formPropina!: FormGroup;

  public formDomi!: FormGroup;

  public productos: ProductoDto[] = []; 

  public productosFiltrados: ProductoDto[] = [];

  public categoriasCargadas: boolean = false;

  public visible: boolean = false;

  public fotoProducto: string = ''

  public productoSeleccionado!: ProductoDto;

  public cantidadSeleccionada: number = 0;

  public nota: string = "";

  public productosSeleccionados: Array<{id_producto: number, cantidad: number}> = [];

  public vender: boolean = true;
  public resumen: boolean = true;

  public compraActual: CompraDto = new CompraDto();

  public carritoCompras: any;
  public visibleCarrito: boolean = false;

  public modalConfirmarPropina: boolean = false;

  @Output() public alSalir = new EventEmitter<boolean>();

  ngOnInit(): void {

    if(this.mesa.estado_actual == 'OCUPADO' || this.mesa.estado_actual == 'FACTURADO') {
      this.vender = false;
      this.getCompraActualMesa(this.mesa.id_mesa);

    }

    this.obtenerProductos();

    this.gestionCategoriasService.getAll().subscribe({
      next: (data) => {
        data.forEach((item: CategoriaDto) => {
          const categoria = { label: item.nombre, value: item.id_categoria }
          this.categorias.push(categoria)
        })
      },
      complete: () => {
        this.categoriasCargadas = true;
      }
    });
    
    this.formPropina = this.fb.group({
      propina: ['', [Validators.required]]
    })

    this.formDomi = this.fb.group({
      documento: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
    })

    this.vendedor = JSON.parse(localStorage.getItem('USUARIO')+'');


    const savedCartItems = localStorage.getItem('carritoCompras');
    if (savedCartItems) {
      this.cartItems = JSON.parse(savedCartItems);
    }
  }

  public cartItems: Array<any> = [];

  private obtenerProductos(): void {
    this.gestionProductosService.getAll().subscribe({
      next: (data) => {

        this.productos = data.filter(producto => producto.estado).map(producto => ({...producto}));
        this.productosFiltrados = data.filter(producto => producto.estado).map(producto => ({...producto}));
      }
    });
  }

  public vendedor: UsuarioDTO = new UsuarioDTO();

  public esAdmin(): boolean {
    
    return this.vendedor.rol.nombre == 'ADMINISTRADOR';
  }

  public volverSeleccionMesa(): void {
    localStorage.removeItem("carritoCompras");
    this.alSalir.emit(true);
  }

  public categoriaSeleccionada: string = 'all';

  public onSortChange() {
    if(this.categoriaSeleccionada == 'all') {
      this.productosFiltrados = [...this.productos];
      
    } else {
      // this.productosFiltrados = [...this.productos.filter(item => item.categoria.id_categoria == this.categoriaSeleccionada)];
      this.productosFiltrados = this.productos.filter(item => item.categoria.id_categoria === this.categoriaSeleccionada)
                                           .map(producto => ({ ...producto }));
    }

  }

  public getSeverity(producto: ProductoDto): string {
    return producto.stock === null ? 'success' : (producto.stock !== null && producto.stock > 0) ? 'success' : 'danger';
  };


  public getLabelStock(producto: ProductoDto): string {
    return producto.stock === null ? 'DISPONIBLE' : (producto.stock !== null && producto.stock > 0) ? 'DISPONIBLE' : 'NO DISPONIBLE';
  }

  public abrirModalAgregarProducto(productoSeleccionado: ProductoDto): void {

    if (productoSeleccionado.stock === null || (productoSeleccionado.stock !== null && productoSeleccionado.stock > 0)) {
      this.nota = '';
      this.cantidadSeleccionada = 0;
      this.visible = true;
  
      this.fotoProducto = this.url + productoSeleccionado.imagen;
      this.productoSeleccionado = productoSeleccionado;
    }
  }


  public hayCarrito(): boolean {
    let carritoCompras = JSON.parse(localStorage.getItem('carritoCompras')+'');

    return carritoCompras;
  }

  public verCarritoCompras(): void {
    this.carritoCompras = JSON.parse(localStorage.getItem('carritoCompras')+'');

    if(this.carritoCompras && this.carritoCompras.length > 0) {
      this.visibleCarrito = true;
    }

  }
  
  public agregarCarrito() {
    let carritoCompras = JSON.parse(localStorage.getItem('carritoCompras')+'') || [];

    const productoExistente = carritoCompras.find((producto: any) => producto.producto.id_producto === this.productoSeleccionado.id_producto);

    if (productoExistente) {
      productoExistente.cantidad += this.cantidadSeleccionada;
      productoExistente.cantidadActual += this.cantidadSeleccionada;
      productoExistente.nota = this.nota;
    } else {
      carritoCompras.push({
        producto: this.productoSeleccionado,
        cantidad: this.cantidadSeleccionada,
        nota: this.nota,
        cantidadActual: this.cantidadSeleccionada
      });
    }


    this.productosFiltrados.forEach(producto => {
      if (producto.id_producto === this.productoSeleccionado.id_producto && producto.stock) {
        producto.stock -= this.cantidadSeleccionada;
      }
    });
    
    localStorage.setItem('carritoCompras', JSON.stringify(carritoCompras));
    this.carritoCompras = carritoCompras;

    this.messageService.add({ key: "imprimir", severity: 'success', summary: 'Exito', detail: 'Producto agregado al carrito', life: 3000 });
    this.visible = false;
  }

  public limpiarCarrito() {
    localStorage.removeItem('carritoCompras');
    this.visibleCarrito = false;

    this.categoriaSeleccionada = 'all';
    this.obtenerProductos();
    //this.productosFiltrados = this.productos
    
  }

  public hayDisponibilidad(): boolean {
    this.carritoCompras = JSON.parse(localStorage.getItem('carritoCompras')+'') || [];
    const productoExistente = this.carritoCompras.find((producto: any) => producto.producto.id_producto === this.productoSeleccionado.id_producto);

    let rta: boolean = false;
    if (productoExistente) {
      if(!productoExistente.producto.stock) {
        rta = true;
      } else {
        rta = productoExistente.producto.stock > this.cantidadSeleccionada;
      }
    } else {
      if(!this.productoSeleccionado.stock) {
        rta = true;
      } else {
        rta = this.productoSeleccionado.stock > this.cantidadSeleccionada;
      }
    }
    
    return rta;

  }

  public seleccionarCantidad(operacion: string) {
    if(operacion == 'suma') {
      this.cantidadSeleccionada++;
    } else if(operacion == 'resta' && this.cantidadSeleccionada > 0){
      this.cantidadSeleccionada--;
    }
  }

  public changeCantidad(operacion: string, item: any): void {

    const productoExistente = this.carritoCompras.find((producto: any) => producto.producto.id_producto === item.producto.id_producto);

    const productoInventario = this.productos.find(producto => producto.id_producto === item.producto.id_producto);
    const productoFiltrado = this.productosFiltrados.find(producto => producto.id_producto === item.producto.id_producto);

    if (productoExistente && productoInventario && productoFiltrado) {

      let cantidadActual = productoExistente.cantidadActual;

      if(operacion == 'suma') {

        if (productoInventario.stock === null || (productoInventario.stock !== null && productoInventario.stock >= cantidadActual)) {
          productoExistente.cantidadActual++;

          if(productoFiltrado.stock !== null && productoFiltrado.stock > 0) {
            productoFiltrado.stock--;
          }
        }
  
      } else if(operacion == 'resta' && cantidadActual > 1){
        productoExistente.cantidadActual--;

        if(productoFiltrado.stock !== null) {
          productoFiltrado.stock++;
        }
      }
    }

    localStorage.setItem('carritoCompras', JSON.stringify(this.carritoCompras));
  }

  public obtenerProductoInventario(productoId: number): ProductoDto {
    const producto = this.productos.find(producto => producto.id_producto === productoId);

    return producto || null!;
  }

  public confirmarPedido(): void {
    const vendedor = JSON.parse(localStorage.getItem('USUARIO')+'');

    const pedidoDtos: PedidoDto[] = this.carritoCompras.map((item: any) => {

      const productoDto: ProductoDto = {
        id_producto: item.producto.id_producto,
        nombre: item.producto.nombre,
        imagen: item.producto.imagen,
        descripcion: item.producto.descripcion,
        precio: item.producto.precio,
        descuento: item.producto.descuento,
        estado: item.producto.estado,
        stock: item.producto.stock,
        categoria: item.producto.categoria
      };
    
      return {
        producto: productoDto,
        nota: item.nota,
        cantidad: item.cantidadActual,
        subtotal: item.producto.precio * item.cantidadActual
      };
    });

    const request: PedidosCompraMesaDto = {
      mesaId: this.mesa.id_mesa,
      meseroId: vendedor.id_usuario,
      pedidoDtos: pedidoDtos
    }

    this.gestionPedidosService.confirmarPedido(request).subscribe({
      next: (data) => {
        this.visibleCarrito = false;
        this.volverSeleccionMesa();
        if(data.error && data.error.length > 0) {
          this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: data.error.join(' - '), life: 3000 });
        } else {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pedido realizado con éxito', life: 3000 });
        }

      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al confirmar la venta, no hay inventario disponible en algún producto.', life: 3000 });

      }
    })
  }

  public handleVenderResumen(): void {

    this.getCompraActualMesa(this.mesa.id_mesa);

    if(this.vender) {
      this.vender = false;
      this.resumen = true;
    } else {
      this.vender = true;
      this.resumen = false;
    }

    this.formPropina.reset();
  }

  private getCompraActualMesa(mesaId: number) {
    this.gestionComprasService.getCompraActualMesa(mesaId).subscribe({
      next: (compraActual) => {
        this.compraActual = compraActual;
      },
      error: (err) => {
        this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });

      }
    })
  }

  requestImpresion: CompraDto = new CompraDto();

  public enviarCompraImpresion(): void {
    
    if(this.esDomi()) {
      this.modalDomicilio = true;
    } else {

      const compraId = this.compraActual.id_compra;
      const propinaPorcentaje = this.formPropina.value.propina;
  
      this.gestionComprasService.propinaCompraPorcentaje(compraId, propinaPorcentaje).subscribe({
        next: (data) => {
  
          this.requestImpresion = data;
          this.compraActual.impresion = data.impresion;
  
        },
        error: (err) => {
          this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });
        },
        complete: () => {
          this.imprimir(this.requestImpresion, null)
        }
      })
    }
    
  }

  public enviarFormDomi(): void {
    const clienteDomi = this.formDomi.value;

    if(this.formDomi.valid) {

      this.gestionComprasService.propinaCompraPorcentaje(this.compraActual.id_compra, 0).subscribe({
        next: (data) => {
  
          this.requestImpresion = data;
          this.compraActual.impresion = data.impresion;
  
        },
        error: (err) => {
          this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });
        },
        complete: () => {
          this.imprimir(this.requestImpresion, clienteDomi)
        }
      })

    }
  }


  private imprimir(compraDto: CompraDto, clienteDomi?: any) {
  
    this.gestionComprasService.imprimir(compraDto, clienteDomi).subscribe({
      next: (data) => {
        this.formPropina.reset();
        this.formDomi.reset();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Compra realizada con éxito', life: 3000 });

      },
      error: (error) => {
        this.compraActual.impresion = false;
        this.gestionComprasService.cambiarEstadoImpresion(this.compraActual.id_compra).subscribe();
        this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error al imprimir la factura', life: 3000 });

      }
    })
  }

  public confirmarPropina(): void {

    const propinaFinal = this.formPropina.value.propina;

    this.gestionComprasService.propinaCompra(this.compraActual.id_compra, propinaFinal).subscribe({
      next: (data) => {
        this.volverSeleccionMesa();
      },
      error: (err) => {
        this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });

      }
    })
  }


  public isValidField(form: any, field: string): boolean | null {
    return (
      form.controls[field].errors &&
      form.controls[field].touched
    );
  }

  public abrirModalConfirmarPropina(): void {
    if(this.esDomi()) {
      this.gestionComprasService.propinaCompra(this.compraActual.id_compra, 0).subscribe({
        next: (data) => {
          this.volverSeleccionMesa();
        },
        error: (err) => {
          this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });
  
        }
      })
    } else {
      this.modalConfirmarPropina = true
    }
  }

  public esDomi(): boolean {
    return this.mesa.numero.toLowerCase().includes('domi');
  }

  public modalDomicilio: boolean = false;

  public eliminarPedido(pedido: PedidoDto): void {
    this.messageService.clear();

    if(this.esAdmin()) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar el producto del pedido?',
        header: 'Advertencia',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        rejectIcon: 'pi pi-times',
        acceptIcon: 'pi pi-check',
        rejectButtonStyleClass: 'p-button-danger p-button-outlined p-button-rounded gap-2',
        acceptButtonStyleClass: 'p-button-success p-button-rounded gap-2',
        accept: () => { 
          this.gestionPedidosService.delete(pedido.id_pedido).subscribe({
            next: (data) => {
              this.messageService.add({ key: 'imprimir', severity: 'success', summary: 'Éxitoso', detail: data.message, life: 3000 });
              this.getCompraActualMesa(this.mesa.id_mesa);
            },
            error: (err) => {
              this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
      
            }
          })
        }
      });
    }

  }

  public eliminarCompra(compraActual: CompraDto): void {
    this.messageService.clear();

    if(this.esAdmin()) {
      this.confirmationService.confirm({
        message: '¿Está seguro que desea canclear la compra?',
        header: 'Advertencia',
        acceptLabel: 'Si',
        rejectLabel: 'No',
        rejectIcon: 'pi pi-times',
        acceptIcon: 'pi pi-check',
        rejectButtonStyleClass: 'p-button-danger p-button-outlined p-button-rounded gap-2',
        acceptButtonStyleClass: 'p-button-success p-button-rounded gap-2',
        accept: () => { 
          this.gestionComprasService.delete(compraActual.id_compra).subscribe({
            next: (data) => {
              this.messageService.add({ key: 'imprimir', severity: 'success', summary: 'Éxitoso', detail: data.message, life: 3000 });
              this.volverSeleccionMesa();
            },
            error: (err) => {
              this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error al eliminar la compra', life: 3000 });
            }
          })
        }
      });
    }

    
  }

  ver() {

    fetch('https://localhost:8000/test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
      }).then(response => {
        console.log(response.json())
      }).catch(err => {
        console.log(err)
      }

    )

    // this.gestionComprasService.test().subscribe({
    //   next: (data) => {
    //     console.log("Test anderson")
    //     console.log(data)
    //   },
    //   error: (err) => {
    //     console.log(err)
    //   }
    // })
  }
}
