import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Reporte, ReportForm, ReportStatus } from '../../models/report';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private readonly apiUrl = 'http://localhost:8080/reportes';
  private readonly httpClient = inject(HttpClient);

  // Obtener todos los reportes
  getAll(): Observable<Reporte[]>{
    return this.httpClient.get<Reporte[]>(this.apiUrl);
  }

  // Obtener reporte por ID
  getById(id: number){
    return this.httpClient.get<Reporte>(`${this.apiUrl}/${id}`);
  }

  // Obtener mis reportes
  getMyReports(){
    return this.httpClient.get<Reporte[]>(`${this.apiUrl}/mis-reportes`);
  }

  // Crear nuevo reporte
  create(reporte: ReportForm){
    return this.httpClient.post<string>(`${this.apiUrl}/reportar`, reporte, {
      responseType: 'text' as 'json'
    });
  }

  // Actualizar reporte (para editar)
  update(id: number, reporte: ReportForm){
    return this.httpClient.put<string>(`${this.apiUrl}/${id}`, reporte, {
      responseType: 'text' as 'json'
    });
  }

  // Cambiar estado de un reporte (solo admin)
  updateStatus(id: number, nuevoEstado: ReportStatus){
    return this.httpClient.put<Reporte>(
      `${this.apiUrl}/${id}/${nuevoEstado}`, 
      {},
      { responseType: 'json' }
    );
  }

  // Eliminar reporte
  delete(id: number){
    return this.httpClient.delete<string>(`${this.apiUrl}/${id}`, {
      responseType: 'text' as 'json'
    });
  }
}
