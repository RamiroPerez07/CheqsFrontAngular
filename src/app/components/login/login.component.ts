import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthServiceService } from '../../services/auth-service.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';
import { IUser } from '../../interfaces/auth.interface';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule, FormsModule, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  authSvc = inject(AuthServiceService);

  toastSvc = inject(ToastrService);

  router = inject(Router);  // Inyectamos el servicio Router

  loginGroupControl = new FormGroup({
    usernameControl: new FormControl("", [Validators.required]),
    passwordControl : new FormControl("", [Validators.required]),
  })

  user! : IUser | null;

  login(){
    if(!this.loginGroupControl.valid){
      this.loginGroupControl.markAllAsTouched();
      return
    }
    const username = this.loginGroupControl.get("usernameControl")?.value as string;
    const password = this.loginGroupControl.get("passwordControl")?.value as string;
    this.authSvc.login(username, password).subscribe({
      next: (user: IUser) => {
        this.user = user;
        this.router.navigate(['']);
        this.toastSvc.success("Inicio de Sesión Exitosa","Bienvenido")
      },
      error: (error : HttpErrorResponse) => {
        if(error.status === 401){
          this.toastSvc.error("Usuario y/o contraseña incorrectos","Credenciales inválidas")
        }
        else{
          this.toastSvc.error("Falló el inicio de sesión","Error")
        }
      }
    })
  }

}
