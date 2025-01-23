import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BankBusinessUserServiceService {

  private readonly _getBankBusinessUserUrl = "http://localhost:5134/api/BankBusinessUsers/by-user-business-bank";

  private readonly _http = inject(HttpClient);

  bbuId : BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null)

  $bbuId = this.bbuId.asObservable();

  constructor() { }

  getBankBusinessUserId(bankId: number, userId: number, businessId: number): Observable<number | null>{
    return this._http.post<number | null>(this._getBankBusinessUserUrl,{bankId, userId, businessId}).pipe(
      tap(
        (bbuId: number | null) => {
          this.bbuId.next(bbuId);
        }
      )
    )
  }

}
