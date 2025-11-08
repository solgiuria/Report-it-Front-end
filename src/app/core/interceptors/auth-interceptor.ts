import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  //1. Recuperamos el token del localstorage q guarde al hacer login
  const jwtToken = localStorage.getItem('token');

  //2. Muestro en consola para ver cuando se ejecuta
  console.log('Interceptor ejecutado');
  console.log('Request saliente a: ', req.url);
  console.log('Token actual: ', jwtToken);

  //3. Si no hay token (ej login y register) dejamos pasar la request normal
  if(jwtToken) return next(req);

  //4. Si hay token, clonamos la request y agregamos el header Authorization (basicamente lo q hacia en postman de poner Authorization y Bearer token en la pestania headers!)
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${jwtToken}`
    }
  });

  console.log('Token agregado al header Authorization');

  //5. Enviamos la request con el token ya incluido
  return next(authReq);
};


