import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IBusiness } from '../../models/business.interface';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AbmCheqDialogComponent } from '../abm-cheq-dialog/abm-cheq-dialog.component';
import { ICheq, ICheqDetail } from '../../interfaces/cheqDetail.interface';
import { CheqsServiceService } from '../../services/cheqs-service.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [MatAutocompleteModule,MatButtonToggleModule, CurrencyPipe,  MatInputModule, MatButtonModule, MatIconModule, MatMenuModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, AsyncPipe],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements OnInit {
  businessControl = new FormControl<IBusiness | string>("", [this.businessValidator]);

  toastSvc = inject(ToastrService);

  options: IBusiness[] = [
    {id: 1, businessName: "Genéricos San Nicolás"},
    {id: 2, businessName: "Farmacia San Nicolás"}
  ];

  filteredOptions!: Observable<IBusiness[]>;

  // Validador personalizado para asegurar que el valor es un IBusiness
  businessValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    // Verificamos si el valor es un objeto con la propiedad 'businessName'
    if (value && typeof value === 'object' && 'businessName' in value) {
      return null; // Validación exitosa
    }
    return { invalidBusiness: true };  // Si no es un objeto IBusiness, retornamos un error
  }

  displayFn(value: IBusiness){
    return value?`${value.businessName}`:"";
  }

  private _filter(name: string): IBusiness[] {
    const filterValue = name.toLowerCase();

    return this.options.filter(option => option.businessName.toLowerCase().includes(filterValue));
  }

  cheqSelection! : SelectionModel<ICheqDetail>

  cheqsDetail! : ICheqDetail[];

  ngOnInit(): void {
    this.filteredOptions = this.businessControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.businessName;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.cheqsSvc.$cheqsDetail.subscribe({
      next: (cheqsDetail) => {
        this.cheqsDetail = cheqsDetail;
      }
    })
    
  }

  readonly dialog = inject(MatDialog);

  readonly cheqsSvc = inject(CheqsServiceService);

  updateCheqs(){
    this.cheqsSvc.getCheqsDetail().subscribe({
      error: (err) => {
        this.toastSvc.error(err, "Error");
      }
    })
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
          //if(!result) return
          this.updateCheqs();
          this.toastSvc.success("Cheque creado correctamente","Nuevo cheque")
        },
        error: (err) => {
          this.toastSvc.error(err, "Error")
        }
      });
    })
  }


  viewMode: "lista" | "grupos" = "lista"

  @Output() changeViewMode = new EventEmitter<"lista" | "grupos">();

  toggleView(event : MatButtonToggleChange){
    this.viewMode = event.value;
    this.changeViewMode.emit(this.viewMode);
  }


}
