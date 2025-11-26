import { Component, computed, inject, signal } from '@angular/core';
import { Reporte, statusFilter } from '../../../models/report';
import { AuthService } from '../../../core/services/auth-service';
import { ReportCard } from '../../../shared/components/report-card/report-card';
import { ReportService } from '../../../core/services/report-service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-my-reports-page',
  standalone: true,
  imports: [ReportCard],
  templateUrl: './my-reports-page.html',
  styleUrl: './my-reports-page.css',
})
export class MyReportsPage {
  private reportService = inject(ReportService);

  // SIGNAL PARA FILTRO DE ESTADO
  readonly selectedStatus = signal<statusFilter>('TODOS');

  // TRAER MIS REPORTES DEL BACKEND
  readonly myReportsLectura = toSignal(
    this.reportService.getMyReports(), 
    { initialValue: [] }
  );

  // SETTER PARA CAMBIAR EL ESTADO
  setStatus(status: statusFilter) {
    this.selectedStatus.set(status);
  }

  // COMPUTED: Reportes filtrados por estado
  readonly myFilteredReports = computed(() => {
    const estado = this.selectedStatus();
    const base = this.myReportsLectura();

    const result = (estado === 'TODOS')
      ? base
      : base.filter(r => r.estado === estado);

    return result;
  });

}
