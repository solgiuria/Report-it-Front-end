import { inject, Injectable } from '@angular/core';
import { reportCategory } from '../../models/categories';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TypeService {
  private readonly apiUrl = 'http://localhost:8080/TipoReportes';
  private readonly httpClient = inject(HttpClient);

  // Obtener todas las categorías
  getAll(){
    return this.httpClient.get<reportCategory[]>(this.apiUrl);
  }

  // Crear categoría (solo admin)
  create(nombre: string){
    return this.httpClient.post<string>(this.apiUrl, { nombre }, {
      responseType: 'text' as 'json'
    });
  }

  // Eliminar categoría (solo admin)
  delete(id: number){
    return this.httpClient.delete<string>(`${this.apiUrl}/${id}`, {
      responseType: 'text' as 'json'
    });
  }  
}
