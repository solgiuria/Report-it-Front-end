import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { inject } from '@angular/core';
import { ReportService } from '../services/report-service';
import { catchError, map, of } from 'rxjs';

//ACA CHEQUEAMOS SI ES DUENIO O SI ES ADMIN (owner seria q si es TU reporte o si sos el admin)
//solo deja pasar si el token trae el rol admin O si el reporte :id
export const ownerOrAdminGuard: CanActivateFn = (route, state) => {

const auth = inject(AuthService);
  const reports = inject(ReportService);
  const router = inject(Router);

  //1. Verificamos si hay token y sino redirigimos a login
  const decoded = auth.getDecodedToken();
  if (!decoded) { router.navigate(['/login']); return false; }


  //2. Verificamos si es admin(si es pasa directo)
  const isAdmin = decoded.roles?.some((r: any) => r.authority === 'ROLE_ADMIN');
  if (isAdmin) return true; // admin pasa

  //3. Tomo el :id de la url, el id del reporte (Extrae el parámetro id de la ruta (ej: /reports/7/edit → id = 7).)
  const reportId = Number(route.paramMap.get('id'));
  if (!reportId) { router.navigate(['/reports']); return false; }

  //4. Obtengo username del usuario loggeado que en mi token esta guardado en "sub"
  const loggedUsername = decoded.sub; 

  //5. Pido el reporte al back y comparo duenio vs logueado (si el logueado es duenio pasa, sino no)
  return reports.getById(reportId).pipe(
    map((reporte) => {
      const ownerUsername = reporte?.usuario?.username;
      const isOwner = ownerUsername === loggedUsername;
      if (isOwner) return true;

      router.navigate(['/reports']);
      return false;
    }),
    catchError(() => {                     //404/403/red afuera
      router.navigate(['/reports']);
      return of(false);
    })
  );

};





/**
 * wnerOrAdminGuard, es el más potente: combina los otros dos y agrega una comparación directa entre el ID del usuario logueado y el ID del recurso que se está intentando acceder.
Si vos (civil) querés ver o editar tus reportes, podés hacerlo.

Si sos admin, podés acceder a todos los reportes.

Pero si sos usuario y querés entrar a /reportes/editar/5 y ese reporte no te pertenece, te bloquea. 
*/