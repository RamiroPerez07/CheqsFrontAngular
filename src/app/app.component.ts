import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';
import { IUser } from './interfaces/auth.interface';
import moment from 'moment';
import { UserDrawerComponent } from './components/user-drawer/user-drawer.component';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserDrawerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'cheq-management-app';

  authSvc = inject(AuthServiceService);

  user! : IUser | null;

  @ViewChild(UserDrawerComponent) userDrawer!: UserDrawerComponent;
  
  toggleUserDrawer(){
    this.userDrawer.toggleDrawer();
  }

  ngOnInit(): void {
    this.authSvc.$user.subscribe({
      next: (user : IUser | null) => {
        this.user = user;
      }
    })
  }
  
}
