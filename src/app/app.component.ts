import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  providers: [MessageService, CommonModule]
})
export class AppComponent implements OnInit {

  constructor(private primengConfig: PrimeNGConfig) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

}
