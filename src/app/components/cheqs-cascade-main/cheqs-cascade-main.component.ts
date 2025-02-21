import { Component, inject, OnInit, viewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe, NgClass } from '@angular/common';
import { FiltersComponent } from '../filters/filters.component';
import { CheqTableComponent } from '../cheq-table/cheq-table.component';
import { CheqsServiceService } from '../../services/cheqs-service.service';
import { ICheqDetail, IGroupedCheqs } from '../../interfaces/cheqDetail.interface';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { CheqsFilterServiceService } from '../../services/cheqs-filter-service.service';
import { IBank } from '../../interfaces/bank.interface';
import { IBusiness } from '../../interfaces/business.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cheqs-cascade-main',
  standalone: true,
  imports: [FiltersComponent, CheqTableComponent, MatExpansionModule, MatIconModule, MatButtonModule, CurrencyPipe, NgClass,],
  templateUrl: './cheqs-cascade-main.component.html',
  styleUrl: './cheqs-cascade-main.component.css'
})
export class CheqsCascadeMainComponent implements OnInit {

accordion = viewChild.required(MatAccordion);

  public viewMode : "lista" | "grupos" = "lista";

  readonly cheqsSvc = inject(CheqsServiceService);
  
  readonly toastSvc = inject(ToastrService);

  readonly authSvc = inject(AuthServiceService);

  readonly routerSvc = inject(Router);

  readonly cheqsFilterSvc = inject(CheqsFilterServiceService);

  public cheqsDetailData! : ICheqDetail[];

  public groupedCheqsDetailData! : IGroupedCheqs[];

  public selectedBank! : IBank | null;

  public selectedBusiness! : IBusiness | null;

  onChangeViewMode(event: "lista" | "grupos" ){
    this.viewMode = event ;
  }

  getCheqs(){
    this.cheqsSvc.$cheqsDetail.subscribe({
      next: (cheqs) => {
        this.cheqsDetailData = [...cheqs];
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.toastSvc.error("Error en la suscripción de cheques. Detalle: " + errorResponse.message,"Error cód. " + errorResponse.status);
      }
    })

    this.cheqsSvc.$groupedCheqsDetail.subscribe({
      next: (cheqs) => {
        this.groupedCheqsDetailData = [...cheqs];
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.toastSvc.error("Error en la suscripción de cheques. Detalle: " + errorResponse.message,"Error cód. " + errorResponse.status);
      }
    })
  }

  ngOnInit(): void {

    this.getCheqs();

    //Que no me deje usar la aplicacion si no estoy autenticado.
    this.authSvc.$user.subscribe({
      next: (user) => {
        if (!user) {
          this.routerSvc.navigate(["login"]);
        }
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.toastSvc.error("Error en la suscripción de usuario. Detalle: " + errorResponse.message,"Error cód. " + errorResponse.status);
      }
    })

    this.cheqsFilterSvc.$filterSelection.subscribe({
      next: (filterSelection) => {
        this.selectedBank = filterSelection.bank;
        this.selectedBusiness = filterSelection.business;
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.toastSvc.error("Error en la suscripción de filtros. Detalle: " + errorResponse.message,"Error cód. " + errorResponse.status);
      }
    })

  }
}
