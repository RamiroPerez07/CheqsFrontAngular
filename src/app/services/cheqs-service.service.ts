import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICheq, ICheqDetail, IGroupedCheqs } from '../interfaces/cheqDetail.interface';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheqsServiceService {

  private readonly _urlCheqsDetail = "http://localhost:5134/api/Cheqs/getCheqsWithDetails";

  private readonly _urlCreateCheq = "http://localhost:5134/api/Cheqs";

  private readonly _urlDeleteCheq = "http://localhost:5134/api/Cheqs";

  private readonly _urlChangeCheqState = "http://localhost:5134/api/Cheqs/ChangeStateId";

  private readonly _http = inject(HttpClient)

  public cheqsDetail = new BehaviorSubject<ICheqDetail[]>([]);

  public groupedCheqsDetail = new BehaviorSubject<IGroupedCheqs[]>([]);

  $cheqsDetail = this.cheqsDetail.asObservable();

  $groupedCheqsDetail = this.groupedCheqsDetail.asObservable();

  initialBalance = 10000;

  private _calculateAccumulatedAmount(cheqsDetailData: ICheqDetail[]) : ICheqDetail[] {
    let accumulatedAmount = this.initialBalance;
    // Itera sobre los datos y acumula el valor de cada cheque
    cheqsDetailData.forEach(row => {
      row['accumulatedAmount'] = accumulatedAmount + row.amount;
      accumulatedAmount += row.amount;
    });
    return cheqsDetailData;

  }

  private _sortData(cheqsDetailData: ICheqDetail[]) : ICheqDetail[] {
    return [...cheqsDetailData.sort((a, b) => {
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

  private _groupAndSortCheqs(cheques: ICheqDetail[]): IGroupedCheqs[] {
    // Paso 1: Agrupar los cheques por "mm/yyyy" usando dueDate
    const grouped = cheques.reduce((acc, cheque) => {
      const date = new Date(cheque.dueDate);  // Cambiado a dueDate
      const period = `${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`; // mm/yyyy
  
      if (!acc[period]) {
        acc[period] = [];
      }
      
      acc[period].push(cheque);
      return acc;
    }, {} as Record<string, ICheqDetail[]>);
  
    // Paso 2: Ordenar los cheques dentro de cada grupo por dueDate (ascendente)
    for (const period in grouped) {
      grouped[period].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());  // Cambiado a dueDate
    }
  
    // Paso 3: Convertir el objeto en un array de objetos con formato adecuado
    return Object.entries(grouped)
      .map(([period, cheqs]) => ({ period, cheqs }))
      .sort((a, b) => {
        const [monthA, yearA] = a.period.split('/').map(Number);
        const [monthB, yearB] = b.period.split('/').map(Number);
        
        // Ordenar cronológicamente
        return yearA !== yearB ? yearA - yearB : monthA - monthB;
      });
  }

  constructor() {}

  getCheqsDetail():Observable<ICheqDetail[]>{
    return this._http.get<ICheqDetail[]>(this._urlCheqsDetail).pipe(
      tap((cheqDetails: ICheqDetail[]) => {

        let cheqs = this._sortData(cheqDetails);
        cheqs = this._calculateAccumulatedAmount(cheqs);
        let groupedCheqsDetail = this._groupAndSortCheqs(cheqs);

        this.cheqsDetail.next(cheqs);
        this.groupedCheqsDetail.next(groupedCheqsDetail);
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

  changeCheqsState(cheqIds: number[], newStateId: number){
    return this._http.put(this._urlChangeCheqState, {cheqIds, newStateId})
  }
}
