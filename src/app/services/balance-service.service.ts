import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IBalance } from '../interfaces/balance.interface';

@Injectable({
  providedIn: 'root'
})
export class BalanceServiceService {

  readonly _getBalanceByBankIdAndBusinessIdUrl = "http://localhost:5134/api/BankBusinesses/balance-by-bank-and-business";

  readonly _http = inject(HttpClient);

  balance : BehaviorSubject<IBalance | null> = new BehaviorSubject<IBalance | null>(null)

  $balance = this.balance.asObservable()

  constructor() { }

  getBalanceByBankIdAndBusinessId(bankId: number, businessId: number): Observable<IBalance | null>{
    return this._http.post<IBalance | null>(this._getBalanceByBankIdAndBusinessIdUrl, {bankId, businessId}).pipe(
      tap(
        (balance: IBalance | null) => {
          this.balance.next(balance);
        }
      )
    )
  }

}
