import { Component, inject, input } from '@angular/core';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Reporte } from '../../../models/report';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [DatePipe], //para formatear dates
  templateUrl: './report-card.html',
  styleUrl: './report-card.css',
})
export class ReportCard {

  private router = inject(Router);
  readonly reporte = input<Reporte>();        //este es el "dato" que la tarjeta va a recibir

  // Navegar al detalle del reporte
  goToDetail() {
    const id = this.reporte()?.id;
    if (id) {
      this.router.navigate(['/app/reports', id]);
    }
  }

  // Truncar descripción para la card
  getTruncatedDescription(): string {               //es buena practica aclarar el tipo de retorno
    const desc = this.reporte()?.descripcion || '';
    const maxLength = 32;
    
    if (desc.length <= maxLength) {
      return desc;
    }
    
    return desc.substring(0, maxLength).trim() + '...';
  }


   formatCategoryName(name: string | undefined): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }



}
