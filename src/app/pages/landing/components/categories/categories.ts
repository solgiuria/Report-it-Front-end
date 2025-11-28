import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TypeService } from '../../../../core/services/type-service';


@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {

  private typeService = inject(TypeService);

  // Cargar categorías desde el back
  readonly categorias = toSignal(this.typeService.getAll(), { initialValue: [] });

    // Para poner iconitos lindos según categoría
    iconMap: Record<string, string> = {
      INFRAESTRUCTURA: "🚧",
      TRANSITO_Y_SENALIZACION: "🚦",
      ACCESIBILIDAD: "♿",
      SEGURIDAD: "🚨",
      MEDIO_AMBIENTE: "🌳",
      CONVIVENCIA: "🤝"
    };


  // Para formatear el nombre igual que en tus cards y detail
  formatCategoryName(name: string): string {
    return name
      .toLowerCase()
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
