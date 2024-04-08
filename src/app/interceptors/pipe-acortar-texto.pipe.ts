import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'acortarTexto'
})
export class AcortarTextoPipe implements PipeTransform {
  transform(texto: string, longitud: number = 10): string {
    if (!texto) return ''; // Manejo de casos nulos o indefinidos
    if (texto.length <= longitud) return texto; // Retornar texto original si es igual o más corto que la longitud deseada
    return texto.substring(0, longitud) + '...'; // Acortar texto y agregar puntos suspensivos
  }
}