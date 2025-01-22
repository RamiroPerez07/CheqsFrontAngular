import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ICheqDetail } from '../../interfaces/cheqDetail.interface';
import { CheqsServiceService } from '../../services/cheqs-service.service';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CheqsFilterServiceService } from '../../services/cheqs-filter-service.service';
import { filter } from 'rxjs';
import { IBank } from '../../interfaces/bank.interface';
import { IBusiness } from '../../interfaces/business.interface';
import { IUser } from '../../interfaces/auth.interface';
import { AuthServiceService } from '../../services/auth-service.service';
import { IBalance } from '../../interfaces/balance.interface';
import { BalanceServiceService } from '../../services/balance-service.service';

@Component({
  selector: 'app-cheq-table',
  standalone: true,
  imports: [MatTableModule, MatCheckboxModule, CurrencyPipe, DatePipe, NgClass, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './cheq-table.component.html',
  styleUrl: './cheq-table.component.css'
})
export class CheqTableComponent implements OnChanges, OnInit{

  @Input() cheqsDetailData! : ICheqDetail[];

  readonly cheqsSvc = inject(CheqsServiceService);
  
  readonly toastSvc = inject(ToastrService);

  readonly cheqsFilterSvc = inject(CheqsFilterServiceService);

  readonly authSvc = inject(AuthServiceService);

  readonly balanceSvc = inject(BalanceServiceService);
  
  public displayedColumns: string[] = ['select', 'issueDate', 'cheqNumber', 'entity', 'dueDate', 'type', 'state', 'amount', 'accumulatedAmount'];
  
  public dataSource = new MatTableDataSource<ICheqDetail>(this.cheqsDetailData);
  
  public cheqSelection = new SelectionModel<ICheqDetail>(true, [])

  public selectedBank! : IBank | null;

  public selectedBusiness!:  IBusiness | null;

  public user! : IUser | null;

  public balance! : IBalance | null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['cheqsDetailData'] || !Array.isArray(changes['cheqsDetailData'].currentValue)) return;
    this.dataSource.data = changes['cheqsDetailData'].currentValue as ICheqDetail[];
  }

  ngOnInit(): void {
    this.cheqsFilterSvc.$filterSelection.subscribe({
      next: (filterSelection) => {
        this.selectedBank = filterSelection.bank;
        this.selectedBusiness = filterSelection.business;
      }
    })

    this.authSvc.$user.subscribe({
      next: (user: IUser | null) => {
        this.user = user;
      }
    })

    this.balanceSvc.$balance.subscribe({
      next: (balance) => {
        this.balance = balance
      }
    })
  }

  updateCheqs(){
    const bank = this.selectedBank;
    const business = this.selectedBusiness;
    const balance = this.balance;
    if(this.user && bank && business && balance){
      this.cheqsSvc.getCheqsDetail(bank.bankId,business.businessId, balance.balance).subscribe(); 
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.cheqSelection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.cheqSelection.clear();
      return;
    }

    this.cheqSelection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ICheqDetail): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.cheqSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.cheqNumber}`;
  }

  deleteCheqs(){
    if (this.cheqSelection.isEmpty()) return
    this.cheqsSvc.deleteCheqs(this.cheqSelection.selected).subscribe({
      next: () => {
        this.toastSvc.success("Eliminar", "Cheques eliminados correctamente");
        this.updateCheqs();
        this.cheqSelection.clear();
      }
    });
  }

  hasNoOverdueChecks(cheqs: ICheqDetail[]): boolean {
    return cheqs.some(cheq => new Date(cheq.dueDate).setHours(0,0,0,0) > new Date().setHours(0,0,0,0));
  }

  areAllCheqsInPortfolio(cheqs: ICheqDetail[]): boolean{
    return cheqs.every(cheq => cheq.stateId === 1);
  }

  areAllCheqsInBank(cheqs: ICheqDetail[]): boolean{
    return cheqs.every(cheq => cheq.stateId === 2);
  }

  changeCheqState(newStateId: number){
    const cheqIds : number[] = [...this.cheqSelection.selected.map(cheq => cheq.cheqId)]
    this.cheqsSvc.changeCheqsState(cheqIds,newStateId).subscribe({
      next: () => {
        this.toastSvc.success("Estado actualizado correctamente", "Actualización");
        this.updateCheqs();
        this.cheqSelection.clear();
      }
    })
  }

}
