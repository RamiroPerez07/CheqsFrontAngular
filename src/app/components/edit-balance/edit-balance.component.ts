import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import moment from 'moment';
import { IBalance } from '../../interfaces/balance.interface';
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
    MatDatepickerModule,
    MatAutocompleteModule,
    CurrencyPipe
  ],
  templateUrl: './edit-balance.component.html',
  styleUrl: './edit-balance.component.css'
})
export class EditBalanceComponent {

  readonly dialogRef = inject(MatDialogRef<EditBalanceComponent>);

  readonly data = inject<MatDialogData>(MAT_DIALOG_DATA);

  public balanceControl = new FormControl<number>(0, [Validators.required])

  onCloseDialog() : void{
      this.dialogRef.close(null);
    }
  
    onSubmit(){
      if(this.balanceControl.valid){
        this.dialogRef.close({
          balance: this.balanceControl.value,
          updatedAt : moment().toDate(),
        });
      }
      this.balanceControl.markAllAsTouched();
      return
    }
}
