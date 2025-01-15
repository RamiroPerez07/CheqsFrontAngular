import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IEntity } from '../interfaces/entity.interface';

@Injectable({
  providedIn: 'root'
})
export class EntitiesServiceService {

  private readonly _urlEntities = "http://localhost:5134/api/Entities";
  
    private readonly _http = inject(HttpClient)
  
    public entities = new BehaviorSubject<IEntity[]>([]);
  
    $entities = this.entities.asObservable();
  
    constructor() {}
  
    getEntities():Observable<IEntity[]>{
      return this._http.get<IEntity[]>(this._urlEntities).pipe(
        tap((entities: IEntity[]) => {
          this.entities.next(entities);
        })
      )
    }
}
