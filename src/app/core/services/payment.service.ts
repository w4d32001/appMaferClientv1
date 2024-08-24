import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../interceptors/apiRooute';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://127.0.0.1:8000/api'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) { }

  checkout(order: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkout`, order);
  }

  validate(rawClientAnswer: any, hash: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/validate`, { rawClientAnswer, hash });
  }

  paid(krAnswer: any, krHash: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/paid`, { 'kr-answer': krAnswer, 'kr-hash': krHash });
  }

  ipn(krAnswer: any, krHash: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ipn`, { 'kr-answer': krAnswer, 'kr-hash': krHash });
  }
}
