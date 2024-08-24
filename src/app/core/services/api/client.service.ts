import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../interceptors/apiRooute';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, CustomerResponse, ResponseCustomer } from '../../models/interfaces/api/customer';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private url = API_URL + '/customer';

  private http = inject(HttpClient);

  
  getCustomer(id: number): Observable<CustomerResponse> {
    return this.http.get<CustomerResponse>(`${this.url}/${id}`);
  }

  createCustomer(customer: Customer): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.url, customer);
  }

  updateCustomer(
    id: number,
    customer: Customer
  ): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.url}/${id}`,
      customer,
      
    );
  }

  deleteCustomer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
  getClientRUC(ruc: string): Observable<any> {
    return this.http.get<any>(`${API_URL}/consultar/${ruc}`);
  }

  updateCustomerAddress(id: number, addressData: any): Observable<any> {
    return this.http.put<any>(`${API_URL}/customer/address/${id}`, addressData);
  }
}
