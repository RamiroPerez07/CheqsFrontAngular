import { Component, inject, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FiltersComponent } from "./components/filters/filters.component";
import { CheqTableComponent } from "./components/cheq-table/cheq-table.component";
import { ICheqDetail, IGroupedCheqs } from './interfaces/cheqDetail.interface';
import { ToastrService } from 'ngx-toastr';
import { CheqsServiceService } from './services/cheqs-service.service';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { LoginComponent } from "./components/login/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FiltersComponent, CheqTableComponent, MatExpansionModule, MatIconModule, MatButtonModule, CurrencyPipe, NgClass, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'cheq-management-app';

  accordion = viewChild.required(MatAccordion);

  viewMode : "lista" | "grupos" = "lista";

  onChangeViewMode(event: "lista" | "grupos" ){
    this.viewMode = event ;
  }

  cheqsSvc = inject(CheqsServiceService);
  
  toastSvc = inject(ToastrService);

  cheqsDetailData! : ICheqDetail[];

  groupedCheqsDetailData! : IGroupedCheqs[];

  initialBalance : number = 10000;

  getCheqs(){
    this.cheqsSvc.$cheqsDetail.subscribe({
      next: (cheqs) => {
        this.cheqsDetailData = [...cheqs];
      },
      error: (err) => {
        this.toastSvc.error(err,"Error");
      }
    })

    this.cheqsSvc.$groupedCheqsDetail.subscribe({
      next: (cheqs) => {
        this.groupedCheqsDetailData = [...cheqs];
      },
      error: (err) => {
        this.toastSvc.error(err,"Error");
      }
    })
  }


  ngOnInit(): void {

    this.cheqsSvc.getCheqsDetail().subscribe({
      next : () => {
        this.getCheqs();
      },
      error: (err) => {
        this.toastSvc.error(err,"Error");
      }
    })

  }

  
}
