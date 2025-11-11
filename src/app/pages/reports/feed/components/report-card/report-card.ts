import { Component, inject, input } from '@angular/core';
import { Reporte } from '../../../../../models/report';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-card',
  standalone: true,
  imports: [DatePipe], //para formatear dates
  templateUrl: './report-card.html',
  styleUrl: './report-card.css',
})
export class ReportCard {

  private router = inject(Router);
  readonly reporte = input<Reporte>();    //este es el "dato" que la tarjeta va a recibir




}
