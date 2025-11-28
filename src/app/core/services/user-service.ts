import { inject, Injectable } from '@angular/core';
import { ChangePasswordRequest, User } from '../../models/user';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:8080/usuarios';
  private readonly httpClient = inject(HttpClient);

  // Obtener perfil del usuario actual
  getProfile(): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/perfil`);
  }

  // Cambiar contraseña
  updatePassword(passwords: ChangePasswordRequest): Observable<string> {
    return this.httpClient.put<string>(`${this.apiUrl}/updatePassword`, passwords, {
      responseType: 'text' as 'json'
    });
  }  

  // Obtener todos los usuarios (solo admin)
  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiUrl);
  }

  // Obtener usuario por ID (solo admin)
  getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/${id}`);
  }

  // Eliminar usuario (solo admin)
  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

}
