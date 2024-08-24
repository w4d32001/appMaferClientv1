import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../interceptors/apiRooute';
import { HttpClient } from '@angular/common/http';
import { Sale } from '../../models/interfaces/api/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private url = API_URL + '/sale';

  private http = inject(HttpClient);

  createSale(sale: any): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.url, sale);
  }


}
