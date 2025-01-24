import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import moment from 'moment';
//import 'moment/locale/es';
import { IBalance, IBalanceDetail } from '../../interfaces/balance.interface';
import { IBusiness } from '../../interfaces/business.interface';
import { IBank } from '../../interfaces/bank.interface';
import { IUser } from '../../interfaces/auth.interface';


interface MatDialogData {
  balance: IBalance | null,
  bank: IBank | null,
  business: IBusiness | null,
  user: IUser | null,
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
      const username = this.data.user?.username;
      const userId = this.data.user?.userId;
      if(bank && business && balance && username && userId){
        const result : IBalanceDetail = {
          balance: balance,
          updatedAt : moment().toDate(),
          bankId : bank.bankId,
          businessId: business.businessId,
          username: username,
          userId: userId,
        }
        this.dialogRef.close(result);
      }
    }
    this.balanceControl.markAllAsTouched();
    return
  }

}
