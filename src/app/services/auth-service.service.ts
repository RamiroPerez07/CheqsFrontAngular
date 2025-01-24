import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IUser } from '../interfaces/auth.interface';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private readonly _urlLogin = "http://localhost:5134/api/Auth/login";

  user = new BehaviorSubject<IUser | null>(null)

  $user = this.user.asObservable();

  private readonly _http = inject(HttpClient);

  constructor() {
    if(typeof window === "undefined") return
    // Si el token existe en el localStorage, se inicializa el BehaviorSubject con el valor del token
    const storedUser = localStorage.getItem('user');
    let parseUser : IUser | null = null;
    if (storedUser) {
      try {
        // Intentamos parsear el string JSON a un objeto de tipo User
        parseUser = JSON.parse(storedUser) as IUser;
        if (parseUser) {
          this.user.next(parseUser);
        }
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
      }
    }
  }

  isAuthenticated():boolean{
    if(typeof window === "undefined") return false;
    return !!localStorage.getItem("user");
  }

  login(username: string, password: string): Observable<IUser>{
    return this._http.post<IUser>(this._urlLogin,{username,password}).pipe(
      tap((user: IUser) => {
        localStorage.setItem("user", JSON.stringify(user));
        this.user.next(user);
      })
    )
  }

  logout(){
    localStorage.removeItem("user");
    this.user.next(null);
  }

}
