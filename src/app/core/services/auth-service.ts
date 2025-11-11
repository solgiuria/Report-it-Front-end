import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../models/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//relacion con el interceptor: guarda el token en el localstorage, se lo entrega al interceptor cuando lo necesita y lo decodifica para saber si esta autenticado y que rol tiene (auth protege la logica interna de sesion y roles)

export class AuthService {
  //url base de mi backend
  private readonly apiUrl = 'http://localhost:8080/auth';
  private readonly httpClient = inject(HttpClient);

  //1. Registro de usuario
  register(newUser: RegisterRequest){
    console.log('POST registrar →', `${this.apiUrl}/registrar`);
    
    return this.httpClient.post<string>(`${this.apiUrl}/registrar`, newUser, {
      responseType:'text' as 'json'
    });
  }

  //2. Login: Envía usuario y contraseña al backend y recibe un token JWT si son válidos.
  login(credentials: LoginRequest) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  //3. Guardar token en localstorage: Guarda el token JWT en el almacenamiento local del navegador.
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }
  

  //4.Obtener token: Recupera el token guardado, si existe.
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //5. Logout: Elimina el token guardado (cierra sesión).
  logout(): void {
    localStorage.removeItem('token');
  }


  //6. Verificar usuario autenticado: Devuelve true si hay un token guardado (sirve para guards o condicionales).
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  //7. Roles : (EXPLICO ABAJO) si queremos saber dentro del front si el usuario logueado es admin o user, tenemos que leer el payload del token, es decir, decodificarlo 
  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    const payload = atob(token.split('.')[1]);   //decodificamos
    return JSON.parse(payload);                  //convertirmos en objeto
  }

  //8 Verificar si es admin
  isAdmin(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.roles?.some((r: any) => r.authority === 'ROLE_ADMIN');
  }


  //9. O si es user comun
  isUser(): boolean {
    const decoded = this.getDecodedToken();
    return decoded?.roles?.some((r: any) => r.authority === 'ROLE_USER');
  }

}



//EXPLICACIONES
/*PASO 7
uando hacés login, tu backend te devuelve un token JWT con tres partes separadas: header (info del tipo de token), paylaod (los datos del usuario) y signature (la firma del servidor)
El payload (la parte del medio) es un JSON codificado en Base64, por ejemplo:

{
  "sub": "sol",
  "roles": [
    { "authority": "ROLE_USER" }
  ],
  "iat": 1733420405,
  "exp": 1733506805
}

Tu AuthService guarda ese token en el localStorage.
Pero si queremos saber dentro del front si el usuario logueado es admin o user, tenemos que leer el payload del token.
Como está codificado, usamos esta línea para decodificarlo:
const payload = atob(token.split('.')[1]);
Así obtenés el JSON con { sub, roles, exp, ... }.
Y PARA QUE LO DECODIFICAMOS?
Una vez que lo decodificamos, podemos acceder a los roles guardados por tu backend (por ejemplo "ROLE_ADMIN" o "ROLE_USER")



*/

/*
pongo responseType:'text' as 'json' xq angular x defecto siempre intenta leer un json y yo puse en mi back q devuelva un string (mas adelante lo puedo cambiar)
y pongo .post<string> xq en mi back si voy a /registrar en registerController puedo ver q ante caso de exito devuelve un string plano

2. .post<loginResponse> xq en mi back en LoginController si sale todo ok devuelvo el token en formato json
*/ 