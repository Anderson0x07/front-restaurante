import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from './primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
  ],
  exports: [
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
  ]

})
export class SharedModule { }
