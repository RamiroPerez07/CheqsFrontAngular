import { NgClass } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { IUser } from '../../interfaces/auth.interface';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-user-drawer',
	standalone: true,
	imports: [
		NgClass,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './user-drawer.component.html',
	styleUrl: './user-drawer.component.css'
})
export class UserDrawerComponent {

	@Input() user : IUser | null = null;

	readonly authSvc = inject(AuthServiceService);

	readonly routerSvc = inject(Router);

	menuOpen = false;

	toggleMenu() {
	  this.menuOpen = !this.menuOpen;  // Cambia el estado del menú (abierto o cerrado)
	}
	
	// Detecta la tecla Escape para cerrar el menú
	@HostListener('document:keydown.escape', ['$event'])
	onEscapePress(event: KeyboardEvent) {
	  this.menuOpen = false;  // Cierra el menú cuando se presiona Escape
	}

	closeUserSession(){
		this.authSvc.logout();
		this.toggleMenu();
	}

	goToMyBusinesses(){
		this.routerSvc.navigate(['/my-businesses']);
		this.toggleMenu();
	}

	goToCheqsCascade(){
		this.routerSvc.navigate(['/']);
		this.toggleMenu();
	}


}
