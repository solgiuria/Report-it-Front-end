// ✅ auth-interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service'; // 👈 ajustá el path según tu estructura

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  //Inyectamos el AuthService para acceder al token y a sus métodos
  const auth = inject(AuthService);

  //Obtenemos el token desde el servicio (que lo saca del localStorage internamente)
  const jwtToken = auth.getToken();

  //Verificamos si la request es a un endpoint de autenticación (login o registrar)
  //Si lo es, no debemos enviar el token porque el usuario todavía no lo tiene
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/registrar');

  //Mostramos en consola información útil para debuggear
  console.log('Interceptor ejecutado');
  console.log('Request saliente a:', req.url);
  console.log('Token actual:', jwtToken); //si es login o register tiene que ser null

  //Si la request es de autenticación o no hay token, dejamos pasar la request tal cual
  if (isAuthEndpoint || !jwtToken) {
    console.log('Request sin token → endpoint público o sin sesión activa');
    return next(req);
  }

  //Si existe token y no es un endpoint público, clonamos la request original
  //y le agregamos el header Authorization con el Bearer token
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${jwtToken}` }
  });

  console.log('Token agregado al header Authorization');

  // 7️⃣ Enviamos la request ya modificada (con el token incluido)
  return next(authReq);
};
