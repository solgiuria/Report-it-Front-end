import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-landing-header',
  standalone:true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './landing-header.html',
  styleUrl: './landing-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush, //En componentes estáticos o de solo presentación (como tus secciones de landing), es buena práctica activarlo porque mejora el rendimiento.No cambia el comportamiento visible, solo hace que Angular trabaje más rápido.
})
export class LandingHeader {

}
