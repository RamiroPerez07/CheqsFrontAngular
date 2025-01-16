import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {AbstractControl, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IBusiness } from '../../models/business.interface';
import { map, Observable, startWith } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
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
  imports: [MatAutocompleteModule,MatButtonToggleModule,  MatInputModule, MatButtonModule, MatIconModule, MatMenuModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, AsyncPipe],
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

    this.cheqsSvc.$cheqSelection.subscribe({
      next: (cheqSelection) => {
        this.cheqSelection = cheqSelection;
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

  deleteCheqs(){
    if (this.cheqSelection.isEmpty()) return
    this.cheqsSvc.deleteCheqs(this.cheqSelection.selected).subscribe({
      next: () => {
        this.toastSvc.success("Eliminar", "Cheques eliminados correctamente");
        this.updateCheqs();
        this.cheqsSvc.clearSelection();
      },
      error: (err) => {
        this.toastSvc.error(err, "Error");
      }
    });
  }

  openDialog():void{
    const dialogRef = this.dialog.open(AbmCheqDialogComponent, {
      data: {
        title: "Nuevo cheque",
        stateId: 1,
        businessUserId : 1,
      }
    })

    dialogRef.afterClosed().subscribe((result: ICheq) => {
      this.cheqsSvc.createCheq(result).subscribe({
        next: () => {
          if(!result) return
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

  groupedCheqs! : [string, ICheqDetail[]][];

  @Output() groupedCheqsEmitter = new EventEmitter<[string, ICheqDetail[]][]>();

  toggleView(event : MatButtonToggleChange){
    console.log(event.value);
    if(event.value === "grupos"){
      if(this.cheqsDetail.length === 0) return
      this.groupedCheqs = this.groupAndSortCheqs(this.cheqsDetail);
    }else{
      this.groupedCheqs = [];
    }
    this.groupedCheqsEmitter.emit(this.groupedCheqs);
  }


  groupAndSortCheqs(cheques: ICheqDetail[]): [string, ICheqDetail[]][] {
    // Paso 1: Agrupar los cheques por "mm/yyyy"
    const grouped = cheques.reduce((acc, cheque) => {
      const date = new Date(cheque.issueDate);
      const key = `${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`; // mm/yyyy
  
      if (!acc[key]) {
        acc[key] = [];
      }
      
      acc[key].push(cheque);
      return acc;
    }, {} as Record<string, ICheqDetail[]>);
  
    // Paso 2: Ordenar los cheques dentro de cada grupo por fecha (ascendente)
    for (const key in grouped) {
      grouped[key].sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());
    }
  
    // Paso 3: Convertir el objeto en un array de tuplas [key, value] y ordenarlo cronológicamente
    return Object.entries(grouped).sort(([keyA], [keyB]) => {
      const [monthA, yearA] = keyA.split('/').map(Number);
      const [monthB, yearB] = keyB.split('/').map(Number);
      
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });
  }


}
