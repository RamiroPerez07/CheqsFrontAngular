import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IBank } from '../interfaces/bank.interface';

@Injectable({
  providedIn: 'root'
})
export class BankServiceService {

  private readonly _http = inject(HttpClient)

  private _getBanksByUserAndBusinessUrl(userId: number, businessId: number) : string{
    return `http://localhost:5134/api/Banks/by-user/${userId}/by-business/${businessId}`
  }

  constructor() {}

  banksByUserAndBusiness = new BehaviorSubject<IBank[]>([])

  $banksByUserAndBusiness = this.banksByUserAndBusiness.asObservable()

  getBanksByUserAndBusiness(userId: number, businessId: number): Observable<IBank[]>{
    return this._http.get<IBank[]>(this._getBanksByUserAndBusinessUrl(userId, businessId)).pipe(
      tap(
        (banks: IBank[]) => {
          this.banksByUserAndBusiness.next(banks);
        }
      )
    )
  }

  

}
