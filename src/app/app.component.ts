import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';
import { IUser } from './interfaces/auth.interface';
import moment from 'moment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'cheq-management-app';

  authSvc = inject(AuthServiceService);

  user! : IUser | null;

  ngOnInit(): void {
    this.authSvc.$user.subscribe({
      next: (user : IUser | null) => {
        this.user = user;
      }
    })
  }
  
}
