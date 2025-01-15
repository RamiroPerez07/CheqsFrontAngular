import { Component, inject, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ICheqDetail } from '../../interfaces/cheqDetail.interface';
import { CheqsServiceService } from '../../services/cheqs-service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cheq-table',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, CurrencyPipe, DatePipe],
  templateUrl: './cheq-table.component.html',
  styleUrl: './cheq-table.component.css'
})
export class CheqTableComponent implements OnInit {

  data! : ICheqDetail[];
  displayedColumns: string[] = ['select', 'issueDate', 'cheqNumber', 'entity', 'dueDate', 'type', 'state', 'amount', 'accumulatedAmount'];
  dataSource = new MatTableDataSource<ICheqDetail>(this.data);


  //selection = new SelectionModel<ICheqDetail>(true, []);
  selection! : SelectionModel<ICheqDetail>;

  cheqsSvc = inject(CheqsServiceService);

  toastSvc = inject(ToastrService);

  initialBalance : number = 10000;

  /** Función para calcular el acumulado */
  calculateAccumulatedAmount(): void {
    let accumulatedAmount = this.initialBalance;
    // Itera sobre los datos y acumula el valor de cada cheque
    this.dataSource.data.forEach(row => {
      row['accumulatedAmount'] = accumulatedAmount + row.amount;
      accumulatedAmount += row.amount;
    });
  }

  sortData() {
    this.data = [...this.data.sort((a, b) => {
      // Asegurarse de convertir dueDate a Date
      const dateA = new Date(a.dueDate); 
      const dateB = new Date(b.dueDate); 
  
      // Verifica si las fechas son válidas
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0; // Si alguna fecha no es válida, no se realiza el orden
      }
  
      return dateA.getTime() - dateB.getTime();
    })];
  }

  updateCheqTable(){
    this.dataSource.data = this.data;
  }

  private _configureCheqsListener(){
    this.cheqsSvc.$cheqsDetail.subscribe({
      next: (cheqsData: ICheqDetail[]) => {
        this.data = cheqsData;
        console.log(cheqsData);
        this.sortData();
        this.updateCheqTable();
        this.calculateAccumulatedAmount();
      },
      error: (err) => {
        this.toastSvc.error(err,"Error");
      }
    })
  }

  /** Llama a la función cada vez que los datos cambian o se cargan */
  ngOnInit(): void {

    this.cheqsSvc.getCheqsDetail().subscribe({
      next : () => {
        this._configureCheqsListener();
      },
      error: (err) => {
        this.toastSvc.error(err,"Error");
      }
    })

    this.cheqsSvc.$cheqSelection.subscribe({
      next: (cheqSelection) => {
        this.selection = cheqSelection;
      }
    })

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICheqDetail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.cheqNumber}`;
  }
}
