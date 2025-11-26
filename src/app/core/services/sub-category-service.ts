import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { reportSubCategory} from '../../models/categories';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  private readonly apiUrl = 'http://localhost:8080/SubTipoReportes';
  private readonly httpClient = inject(HttpClient);

  // Obtener todas las subcategorías
  getAll() {
    return this.httpClient.get<reportSubCategory[]>(this.apiUrl);
  }

  // Crear subcategoría (solo admin)
  create(nombre: string, tipoId: number){
    return this.httpClient.post<string>(this.apiUrl, { nombre : nombre, idTipoReporte: tipoId }, {
      responseType: 'text' as 'json'
    });
  }

  // Eliminar subcategoría (solo admin)
  delete(id: number){
    return this.httpClient.delete<string>(`${this.apiUrl}/${id}`, {
      responseType: 'text' as 'json'
    });
  }  
}
