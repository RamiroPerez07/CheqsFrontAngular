import { Component, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'

@Component({
	selector: 'app-user-drawer',
	standalone: true,
	imports: [MatSidenavModule],
	templateUrl: './user-drawer.component.html',
	styleUrl: './user-drawer.component.css'
})
export class UserDrawerComponent {

	@ViewChild(MatDrawer) userDrawer! : MatDrawer;

	toggleDrawer(){
		this.userDrawer.toggle();
	}
}
