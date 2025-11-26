export interface User {
  id: number;
  nombre: string;
  apellido: string;
  edad: number;
  email: string;
  dni: number;
  username: string;
  password: string; // 💡 Existe en el JSON, pero NO se debe mostrar nunca en el front
}


export interface ChangePasswordRequest {
  contrasenaVieja: string;
  contrasenaNueva: string;
}


// Luego ver si conviene ocultar password en el back para seguridad (recomendadísimo), pero por ahora lo usamos como viene.