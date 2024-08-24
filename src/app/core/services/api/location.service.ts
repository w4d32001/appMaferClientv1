import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = 'https://www.universal-tutorial.com/api';
  private apiToken = '9vvO1hL8-HR70RvaoFcvc2g8zQTRSXrdCjRiUleM45yxl03tY8HLq8dztErNd6fKzY8';
  private userEmail = 'freedom01022001@gmail.com';

  private http = inject(HttpClient)

  getAccessToken(): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'api-token': this.apiToken,
      'user-email': this.userEmail,
    });

    return this.http.get(`${this.apiUrl}/getaccesstoken`, { headers });
  }

  // Obtener departamentos (estados) de Perú
  getDepartments(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.apiUrl}/states/Peru`, { headers });
  }

  // Obtener provincias (ciudades) de un departamento específico
  getProvinces(accessToken: string, department: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.apiUrl}/cities/${department}`, { headers });
  }

  getDistricts(accessToken: string, province: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
    });

    return this.http.get(`${this.apiUrl}/cities/${province}`, { headers });
  }

}
