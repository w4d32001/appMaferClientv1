import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../interceptors/apiRooute';
import { Order, OrderResponse } from '../../models/interfaces/api/order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private http = inject(HttpClient)

  private url = API_URL + "/order"

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.url}/showCustomer/${id}`);
  }

  constructor() { }
}
