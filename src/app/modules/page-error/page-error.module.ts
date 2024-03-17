import { NgModule } from '@angular/core';
import { PageErrorComponent } from './page-error.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: PageErrorComponent
      }
    ]),
  ],
  declarations: [
    PageErrorComponent
  ]
})
export class PageErrorModule { }
