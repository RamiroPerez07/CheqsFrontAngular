import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//import moment from 'moment';
//import 'moment/locale/es';
import * as moment from 'moment-timezone';
import { IBalance, IBalanceDetail } from '../../interfaces/balance.interface';
import { IBusiness } from '../../interfaces/business.interface';
import { IBank } from '../../interfaces/bank.interface';


interface MatDialogData {
  balance: IBalance | null,
  bank: IBank | null,
  business: IBusiness | null,
}

@Component({
  selector: 'app-edit-balance',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    CurrencyPipe
  ],
  templateUrl: './edit-balance.component.html',
  styleUrl: './edit-balance.component.css'
})
export class EditBalanceComponent {

  readonly dialogRef = inject(MatDialogRef<EditBalanceComponent>);

  readonly data = inject<MatDialogData>(MAT_DIALOG_DATA);

  public balanceControl = new FormControl<number>(0, [Validators.required]);

  onCloseDialog() : void{
    this.dialogRef.close(null);
  }
  
  onSubmit(){
    if(this.balanceControl.valid){
      const bank = this.data.bank;
      const business = this.data.business;
      const balance = this.balanceControl.value;
      console.log("La hora arrojada es: ", moment.tz("America/Argentina/Buenos_Aires").toDate())
      if(bank && business && balance){
        const result : IBalanceDetail = {
          balance: balance,
          updatedAt : moment.tz("America/Argentina/Buenos_Aires").toDate(),
          bankId : bank.bankId,
          businessId: business.businessId,
        }
        this.dialogRef.close(result);
      }
    }
    this.balanceControl.markAllAsTouched();
    return
  }

}
