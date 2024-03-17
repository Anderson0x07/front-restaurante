import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeguridadService } from './service/seguridad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private seguridadService: SeguridadService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  loginForm!: FormGroup;

  private initForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  public onLogin(){
    if(this.loginForm.valid) {

      this.seguridadService.login(this.loginForm.value).subscribe({
        next: (data) => {
          localStorage.setItem('AUTH', JSON.stringify(data))
          this.router.navigate(['admin/dashboard']);
        },
        error: (err) => {
          console.log(err)
        }
      })

    }
  }

}
