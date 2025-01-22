import { Injectable } from '@angular/core';
import { IBusiness } from '../interfaces/business.interface';
import { IBank } from '../interfaces/bank.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheqsFilterServiceService {

  public filterSelection : BehaviorSubject<{
      business: IBusiness | null,
      bank: IBank | null,
    }> = new BehaviorSubject<{
      business: IBusiness | null,
      bank: IBank | null,
    }>({business: null, bank: null}) 

  constructor() { }

  $filterSelection = this.filterSelection.asObservable()

  setBusiness(business: IBusiness | null){
    this.filterSelection.next({
      business: business ,
      bank: this.filterSelection.value.bank
    })
  }

  setBank(bank: IBank | null){
    this.filterSelection.next({
      business: this.filterSelection.value.business,
      bank: bank,
    })
  }
}
