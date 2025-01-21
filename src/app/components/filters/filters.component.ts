import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { map, Observable, of, startWith } from 'rxjs';
import { AsyncPipe, CurrencyPipe, JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AbmCheqDialogComponent } from '../abm-cheq-dialog/abm-cheq-dialog.component';
import { ICheq, ICheqDetail } from '../../interfaces/cheqDetail.interface';
import { CheqsServiceService } from '../../services/cheqs-service.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { BusinessServiceService } from '../../services/business-service.service';
import { AuthServiceService } from '../../services/auth-service.service';
import { IUser } from '../../interfaces/auth.interface';
import { IBusiness } from '../../interfaces/business.interface';
import { IBank } from '../../interfaces/bank.interface';
import { BankServiceService } from '../../services/bank-service.service';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatAutocompleteModule,MatButtonToggleModule, CurrencyPipe, JsonPipe	,  MatInputModule, MatButtonModule, MatIconModule, MatMenuModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {
  
  readonly toastSvc = inject(ToastrService);
  
  readonly businessSvc = inject(BusinessServiceService);

  readonly bankSvc = inject(BankServiceService);
  
  readonly authSvc = inject(AuthServiceService);
  
  readonly dialog = inject(MatDialog);
  
  readonly cheqsSvc = inject(CheqsServiceService);

  public viewMode: "lista" | "grupos" = "lista";
  
  @Output() changeViewMode = new EventEmitter<"lista" | "grupos">();
  
  public businessOptions!: IBusiness[];

  public bankOptions! : IBank[];
  
  public filteredBusinessOptions!: Observable<IBusiness[]>;

  public filteredBankOptions! : Observable<IBank[]>;
  
  public businessControl = new FormControl<IBusiness | string>("", [this.businessValidator]);

  public bankControl = new FormControl<IBank | string>("", [this.bankValidator]);
  
  public cheqsDetail! : ICheqDetail[];

  public cheqSelection! : SelectionModel<ICheqDetail>;

  public user! : IUser | null;

  public filterSelection : {
    business: IBusiness | null,
    bank: IBank | null,
  } = {business: null, bank: null}

  // Validador personalizado para asegurar que el valor es un IBusiness
  businessValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    // Verificamos si el valor es un objeto con la propiedad 'businessName'
    if (value && typeof value === 'object' && 'businessName' in value) {
      return null; // Validación exitosa
    }
    return { invalidBusiness: true };  // Si no es un objeto IBusiness, retornamos un error
  }

  bankValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (value && typeof value === 'object' && 'bankName' in value) {
      return null;
    }
    return { invalidBank: true }
  }

  displayFn(value: IBusiness){
    return value?`${value.businessName}`:"";
  }

  displayFnBank(value : IBank){
    return value?`${value.bankName}`:"";
  }

  private _filter(name: string): IBusiness[] {
    const filterValue = name.toLowerCase();

    return this.businessOptions.filter(option => option.businessName.toLowerCase().includes(filterValue));
  }

  private _filterBank(name: string): IBank[] {
    const filterValue = name.toLowerCase();

    return this.bankOptions.filter(option => option.bankName.toLowerCase().includes(filterValue))
  }


  ngOnInit(): void {

    this.authSvc.$user.subscribe({
      next: (user: IUser | null) => {
        if (user){
          this.user = user;
          this.getBusinesses(user.userId);
        }
      }
    })

    this.cheqsSvc.$cheqsDetail.subscribe({
      next: (cheqsDetail) => {
        this.cheqsDetail = cheqsDetail;
      }
    })
    
  }

  getBusinesses(userId : number){
    this.businessSvc.getBusinessesByUserId(userId).subscribe({
      next: (businesses: IBusiness[]) => {
        this.businessOptions = businesses;
        this._configureFilteredOptions();
      }
    })
  }

  private _configureFilteredOptions(){
    this.filteredBusinessOptions = this.businessControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.businessName;
        this.filterSelection.business = null;
        this.bankControl.reset(); //El combo de bancos se resetea porque cambia la opcion
        this.filteredBankOptions = of([]) //Las opciones filtradas se limpian por si quedaron
        return name ? this._filter(name as string) : [...this.businessOptions];
      }),
    );
  }

  onSelectBusiness(event: MatAutocompleteSelectedEvent){
    const business = event.option.value as IBusiness
    if(this.user && business){
      this.bankSvc.getBanksByUserAndBusiness(this.user?.userId, business.businessId).subscribe({
        next: (banks : IBank[]) => {
          this.bankOptions = banks;
          this.filterSelection.business = business;
          this._configureBankFilteredOptions();
        }
      })
    }
  }

  onSelectBank(event: MatAutocompleteSelectedEvent){
    const bank = event.option.value as IBank
    if(this.user && bank && this.filterSelection.business){
      this.filterSelection.bank = bank;
    }
  }

  private _configureBankFilteredOptions(){
    this.filteredBankOptions = this.bankControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.bankName;
        return name ? this._filterBank(name as string) : [...this.bankOptions];
      }),
    );
  }


  updateCheqs(){
    if(this.user && this.filterSelection.bank && this.filterSelection.business){
      const userId = this.user.userId;
      const bankId = this.filterSelection.bank.bankId;
      const businessId = this.filterSelection.business.businessId;
      this.cheqsSvc.getCheqsDetail(userId,bankId,businessId).subscribe()
    }
  }

  
  openDialog():void{
    const dialogRef = this.dialog.open(AbmCheqDialogComponent, {
      data: {
        title: "Nuevo cheque",
        stateId: 1,
        bankBusinessUserId : 1,
      }
    })

    dialogRef.afterClosed().subscribe((result: ICheq) => {
      if(!result) return
      this.cheqsSvc.createCheq(result).subscribe({
        next: () => {
          this.updateCheqs();
          this.toastSvc.success("Cheque creado correctamente","Nuevo cheque")
        }
      });
    })
  }


  toggleView(event : MatButtonToggleChange){
    this.viewMode = event.value;
    this.changeViewMode.emit(this.viewMode);
  }


}
