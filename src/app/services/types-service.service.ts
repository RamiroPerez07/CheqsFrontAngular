import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ICheqType } from '../interfaces/types.interface';

@Injectable({
  providedIn: 'root'
})
export class TypesServiceService {
  private readonly _urlEntities = "http://localhost:5134/api/Types";
    
      private readonly _http = inject(HttpClient)
    
      public types = new BehaviorSubject<ICheqType[]>([]);
    
      $types = this.types.asObservable();
    
      constructor() {}
    
      getCheqTypes():Observable<ICheqType[]>{
        return this._http.get<ICheqType[]>(this._urlEntities).pipe(
          tap((types: ICheqType[]) => {
            this.types.next(types);
          })
        )
      }
}
