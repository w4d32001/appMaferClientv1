import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../interceptors/apiRooute';
import { Inventory, InventoryResponse } from '../../models/interfaces/api/inventory';
import { Observable } from 'rxjs';
import { BaseService } from '../../interceptors/base.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  private inventoryURL = API_URL + "/inventory"
  private http = inject(HttpClient)

  protected getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getInventories(): Observable<InventoryResponse> {
    return this.http.get<InventoryResponse>(this.inventoryURL, {
      headers: this.getAuthHeaders(),
    });
  }

  getInventory(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.inventoryURL}/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
  
}
