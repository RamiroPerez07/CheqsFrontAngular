import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServiceService } from './services/auth-service.service';
import { IUser } from './interfaces/auth.interface';
import moment from 'moment';
import { UserDrawerComponent } from './components/user-drawer/user-drawer.component';
import { MatDrawer, MatDrawerContainer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    UserDrawerComponent,
    MatSidenavModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'cheq-management-app';

  authSvc = inject(AuthServiceService);

  user! : IUser | null;

  @ViewChild(UserDrawerComponent) userDrawer!: UserDrawerComponent;
  
  toggleUserDrawer(){
    if(this.user){
      this.userDrawer.toggleMenu();
      return
    }
  }

  ngOnInit(): void {
    this.authSvc.$user.subscribe({
      next: (user : IUser | null) => {
        this.user = user;
      }
    })
  }
  
}
