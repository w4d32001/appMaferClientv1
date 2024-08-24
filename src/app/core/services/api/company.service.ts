import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../../interceptors/apiRooute';
import { Observable } from 'rxjs';
import { Company, CompanyR, CompanyResponse } from '../../models/interfaces/api/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private http = inject(HttpClient)

  private url = API_URL + "/company"

  getCompany(id: number): Observable<CompanyR> {
    return this.http.get<CompanyR>(`${this.url}/${id}`);
  }
}
