import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatButton } from "@angular/material/button";
import { FiltersComponent } from "./components/filters/filters.component";
import { CheqTableComponent } from "./components/cheq-table/cheq-table.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButton, FiltersComponent, CheqTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cheq-management-app';
}
