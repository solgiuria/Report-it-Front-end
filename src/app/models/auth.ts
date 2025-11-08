export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
export interface RegisterRequest {
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  dni: number;
  username: string;
  password: string;
}