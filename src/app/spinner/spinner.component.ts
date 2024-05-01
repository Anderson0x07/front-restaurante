import { Component } from '@angular/core';
import { SpinnerState } from 'src/app/interceptors/spinner.state';

/**
 * Componente para mostrar el Spinner cuando se hacen peticiones HTTP
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  constructor(public spinnerState: SpinnerState) {}
}
