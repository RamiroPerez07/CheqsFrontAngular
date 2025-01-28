import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IBusiness, IBusinessDetail } from '../interfaces/business.interface';

@Injectable({
  providedIn: 'root'
})
export class BusinessServiceService {

  private readonly _getBusinessesByUserIdUrl = "http://localhost:5134/api/Businesses/by-user/";

  private readonly _getBusinessFullDetailByUserUrl = "http://localhost:5134/api/Businesses/getBusinessDetailByUserId";

  private readonly _http = inject(HttpClient);

  public businesses = new BehaviorSubject<IBusiness[]>([]);

  $businesses = this.businesses.asObservable();

  public businessesDetail = new BehaviorSubject<IBusinessDetail[]>([]);

  $businessesDetail = this.businessesDetail.asObservable();

  constructor() { }

  getBusinessesByUserId(userId: number): Observable<IBusiness[]>{
    return this._http.get<IBusiness[]>(`${this._getBusinessesByUserIdUrl}${userId}`).pipe(
      tap((businesses: IBusiness[]) => {
        this.businesses.next(businesses);
      })
    )
  }

  getBusinessFullDetailByUserId(userId: number) : Observable<IBusinessDetail[]>{
    return this._http.post<IBusinessDetail[]>(this._getBusinessFullDetailByUserUrl, userId).pipe(
      tap((businesses: IBusinessDetail[]) => {
        this.businessesDetail.next(businesses);
      })
    )
  }

}
