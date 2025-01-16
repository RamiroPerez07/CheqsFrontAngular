import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICheq, ICheqDetail } from '../interfaces/cheqDetail.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root'
})
export class CheqsServiceService {

  private readonly _urlCheqsDetail = "http://localhost:5134/api/Cheqs/getCheqsWithDetails";

  private readonly _urlCreateCheq = "http://localhost:5134/api/Cheqs";

  private readonly _urlDeleteCheq = "http://localhost:5134/api/Cheqs";

  private readonly _http = inject(HttpClient)

  public cheqsDetail = new BehaviorSubject<ICheqDetail[]>([]);

  $cheqsDetail = this.cheqsDetail.asObservable();

  public cheqSelection = new BehaviorSubject<SelectionModel<ICheqDetail>>(new SelectionModel<ICheqDetail>(true, []));

  $cheqSelection = this.cheqSelection.asObservable();

  // Actualizar la selección
  updateCheqSelection(selection: ICheqDetail[]): void {
    const selectionModel = new SelectionModel<ICheqDetail>(true, selection);
    this.cheqSelection.next(selectionModel); // Actualiza la selección
  }

  // Limpiar la selección global
  clearSelection(): void {
    this.cheqSelection.next(new SelectionModel<ICheqDetail>(true, [])); // Limpiar la selección
  }

  constructor() {}

  getCheqsDetail():Observable<ICheqDetail[]>{
    return this._http.get<ICheqDetail[]>(this._urlCheqsDetail).pipe(
      tap((cheqDetails: ICheqDetail[]) => {
        this.cheqsDetail.next(cheqDetails);
      })
    )
  }

  createCheq(cheq: ICheq):Observable<ICheq>{
    return this._http.post<ICheq>(this._urlCreateCheq, cheq)
  }

  deleteCheqs(cheqs: ICheqDetail[]){
    const ids = [...cheqs.map(ch => ch.cheqId)]
    return this._http.delete<ICheqDetail[]>(this._urlDeleteCheq, {body: ids})
  }
}
