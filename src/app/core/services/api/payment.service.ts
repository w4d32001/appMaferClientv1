import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../interceptors/apiRooute';
import { Observable } from 'rxjs';
import { PaymentResponse } from '../../models/interfaces/api/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private url = API_URL + "/payment"
  private http = inject(HttpClient)

  getPayments(): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(this.url);
  }
}
