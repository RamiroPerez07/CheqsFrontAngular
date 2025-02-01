import { Component, inject, OnInit, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { IBusiness, IBusinessDetail } from '../../interfaces/business.interface';
import { BusinessServiceService } from '../../services/business-service.service';
import { IUser } from '../../interfaces/auth.interface';
import { AuthServiceService } from '../../services/auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UsersTableComponent } from "../users-table/users-table.component";

@Component({
  selector: 'app-business-management',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    UsersTableComponent,
    CurrencyPipe,
],
  templateUrl: './business-management.component.html',
  styleUrl: './business-management.component.css'
})
export class BusinessManagementComponent implements OnInit{
  accordion = viewChild.required(MatAccordion);

  businesses! : IBusinessDetail[];

  user! : IUser | null;

  readonly businessSvc = inject(BusinessServiceService);

  readonly authSvc = inject(AuthServiceService);

  readonly toastSvc = inject(ToastrService);

  ngOnInit(): void {

    this.authSvc.$user.subscribe({
      next: (user: IUser | null) => {
        this.user = user;
        const queryUserId = this.user?.userId;
        if(queryUserId){
          this.getBusiness(queryUserId);
        }
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.toastSvc.error("Error en la suscripción de usuario. Detalle: " + errorResponse.message,"Error cód. " + errorResponse.status);
      }
    })

    
  }

  getBusiness(userId: number){
    this.businessSvc.getBusinessFullDetailByUserId(userId).subscribe({
      next: (businesses: IBusinessDetail[]) => {
        this.businesses = businesses;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.toastSvc.error("Error al obtener las empresas del usuario. Detalle: " + errorResponse.message,"Error cód. " + errorResponse.status);
      }
    })
  }


}
