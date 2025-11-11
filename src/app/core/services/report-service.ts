import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:8080/reportes';

  getById(id: number){
    // tu back: GET /reportes/obteneruno/{id}
    return this.http.get<any>(`${this.api}/obteneruno/${id}`);
  }
}
