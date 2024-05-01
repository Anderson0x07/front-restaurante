import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
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
  templateUrl: './seleccion-productos.component.html'
})
export class SeleccionProductosComponent implements OnInit, OnDestroy {

  constructor(
    private gestionCategoriasService: GestionCategoriasService,
    private gestionProductosService: GestionProductosService,
    private gestionComprasService: GestionComprasService,
    private gestionPedidosService: GestionPedidosService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) { }

  ngOnDestroy(): void {
    this.formPropina.reset();
  }

  @Input() mesa!: MesaDto

  public url = url;

  public categorias: SelectItem[] = [{label: 'Todos', value: 'all'}];

  public itemsPropinas: SelectItem[] = [
    { label: "3%", value: 3 },
    { label: "5%", value: 5 },
    { label: "7%", value: 7 },
    { label: "10%", value: 10 },
  ]

  public formPropina!: FormGroup;

  public productos!: ProductoDto[]; 

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

    if(this.mesa.estado_actual == 'OCUPADO') {
      this.vender = false;
      this.getCompraActualMesa(this.mesa.id_mesa);

    }

    this.gestionProductosService.getAll().subscribe({
      next: (data) => {
        this.productos = data.filter(producto => producto.estado);
        this.productosFiltrados = data.filter(producto => producto.estado);
      }
    });

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

  }

  public esAdmin(): boolean {
    const vendedor: UsuarioDTO = JSON.parse(localStorage.getItem('USUARIO')+'');
    
    return vendedor.rol.nombre == 'ADMINISTRADOR';
  }

  public volverSeleccionMesa(): void {
    localStorage.removeItem("carritoCompras");
    this.alSalir.emit(true);
  }


  public onSortChange(event: any) {
    let value = event.value;
    if(value == 'all') {
      this.productosFiltrados = this.productos;
      
    } else {
      this.productosFiltrados = this.productos.filter(item => item.categoria.id_categoria == value);
    }

  }

  public getSeverity(producto: ProductoDto): string {
    return producto.stock <= 0 ? 'danger' : 'success';
  };

  public abrirModalAgregarProducto(productoSeleccionado: ProductoDto): void {
    if(productoSeleccionado.stock > 0) {
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

    // this.productos.forEach(producto => {
    //   if (producto.id_producto === this.productoSeleccionado.id_producto) {
    //     producto.stock -= this.cantidadSeleccionada;
    //   }
    // });

    console.log(this.cantidadSeleccionada)

    this.productosFiltrados.forEach(producto => {
      if (producto.id_producto === this.productoSeleccionado.id_producto) {
        producto.stock -= this.cantidadSeleccionada;
      }
    });
    
    localStorage.setItem('carritoCompras', JSON.stringify(carritoCompras));
    this.carritoCompras = carritoCompras;

    this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Producto agregado al carrito', life: 3000 });
    this.visible = false;
  }

  public limpiarCarrito() {
    localStorage.removeItem('carritoCompras');
    this.visibleCarrito = false;
    this.productosFiltrados = [...this.productos];
    
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

    console.log(productoInventario?.stock)

    if (productoExistente && productoInventario) {

      let cantidadActual = productoExistente.cantidadActual;

      if(operacion == 'suma') {

        if(productoInventario.stock > cantidadActual) {
          productoExistente.cantidadActual++;
        }
  
      } else if(operacion == 'resta' && cantidadActual > 1){
        productoExistente.cantidadActual--;
      }
      
    }

    localStorage.setItem('carritoCompras', JSON.stringify(this.carritoCompras));
   
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
        cantidad: item.cantidad,
        subtotal: item.producto.precio * item.cantidad
      };
    });

    const request: PedidosCompraMesaDto = {
      mesaId: this.mesa.id_mesa,
      meseroId: vendedor.id_usuario,
      pedidoDtos: pedidoDtos
    }

    this.gestionPedidosService.confirmarPedido(request).subscribe({
      next: (data) => {
        console.log(data)
        this.visibleCarrito = false;
        this.volverSeleccionMesa();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pedido realizado con éxito', life: 3000 });

      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al confirmar la venta', life: 3000 });

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
  }

  private getCompraActualMesa(mesaId: number) {
    this.gestionComprasService.getCompraActualMesa(mesaId).subscribe({
      next: (compraActual) => {
        this.compraActual = compraActual;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  requestImpresion: CompraDto = new CompraDto();

  public enviarPropina(): void {
    const compraId = this.compraActual.id_compra;
    const propinaPorcentaje = this.formPropina.value.propina;

    this.gestionComprasService.propinaCompraPorcentaje(compraId, propinaPorcentaje).subscribe({
      next: (data) => {
        console.log(data)

        this.requestImpresion = data;
        this.compraActual.impresion = data.impresion;

      },
      error: (err) => {
        this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });
      },
      complete: () => {
        this.imprimir(this.requestImpresion, {})
      }
    })
  }

  private imprimir(compraDto: CompraDto, clienteDomi?: any): void {
    this.gestionComprasService.imprimir(compraDto, clienteDomi).subscribe({
      next: (data) => {
        console.log(data)
        this.formPropina.reset();
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Compra realizada con éxito', life: 3000 });

      },
      error: (data) => {
        console.log(data)
        this.compraActual.impresion = false;
        this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error al imprimir la factura', life: 3000 });

      }
    })
  }

  public confirmarPropina(): void {

    const propinaFinal = this.formPropina.value.propina;

    this.gestionComprasService.propinaCompra(this.compraActual.id_compra, propinaFinal).subscribe({
      next: (data) => {
        console.log(data)
        this.volverSeleccionMesa();
      },
      error: (err) => {
        this.messageService.add({ key: 'imprimir', severity: 'error', summary: 'Error', detail: 'Error interno de servidor', life: 3000 });

      }
    })
  }


  public isValidField(field: string): boolean | null {
    return (
      this.formPropina.controls[field].errors &&
      this.formPropina.controls[field].touched
    );
  }

}
