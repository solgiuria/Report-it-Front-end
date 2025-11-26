import { DatePipe } from '@angular/common';
import { Component, effect, inject, linkedSignal, signal } from '@angular/core';
import { Reporte, ReportStatus } from '../../../../../models/report';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../../../core/services/report-service';
import { AuthService } from '../../../../../core/services/auth-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-detail-page',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './report-detail-page.html',
  styleUrl: './report-detail-page.css',
})
export class ReportDetailPage {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);
  private authService = inject(AuthService);

  // Obtener el ID desde la ruta
  readonly id = Number(this.route.snapshot.paramMap.get('id')); 
  
  // Cargar el reporte automáticamente con toSignal
  readonly reporteLectura = toSignal(this.reportService.getById(this.id));
  readonly reporte = linkedSignal(() => this.reporteLectura());

  // Signal para saber si el reporte es del usuario actual
  readonly isMine = signal<boolean>(false);

  // Signal para saber si es admin
  readonly isAdmin = signal<boolean>(false);

  // Signal para el estado seleccionado (para el dropdown)
  readonly selectedStatus = signal<ReportStatus>('PENDIENTE');

  // Signal para mostrar/ocultar el selector de estado
  readonly showStatusSelector = signal<boolean>(false);

  // Estados disponibles
  readonly availableStatuses: ReportStatus[] = ['PENDIENTE', 'EN_PROCESO', 'FINALIZADO'];

  constructor() {
    // Verificar si es admin
    this.isAdmin.set(this.authService.isAdmin());

    effect(() => {
      const report = this.reporte();
      if (report) {
        const currentUsername = this.authService.getUsernameFromToken();
        this.isMine.set(report.usuario.username === currentUsername);
        
        // Inicializar el estado seleccionado con el estado actual del reporte
        this.selectedStatus.set(report.estado as ReportStatus);
      }
    });
  }

  // Formatear nombres de categorías
  formatCategoryName(name: string): string {
    return name
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Volver atrás
  goBack() {
    if(this.isMine()){
      this.router.navigate(['/app/reports/my']);
    }else{
      this.router.navigate(['/app/reports']);  
    }
  }

  // Navegar a la página de edición
  handleEdit() {
    this.router.navigate(['/app/reports', this.id, 'edit']); 
  }

  // Eliminar el reporte
  handleDelete() {
    if (confirm('¿Estás seguro de que querés eliminar este reporte? Esta acción no se puede deshacer.')) {
      this.reportService.delete(this.id).subscribe({ 
        next: () => {
          alert('Reporte eliminado exitosamente');
          this.router.navigate(['/app/reports/my']);
        },
        error: (err) => {
          console.error('Error al eliminar reporte:', err);
          alert('Error al eliminar el reporte');
        }
      });
    }
  }

  // Retorna la clase CSS completa (con badge)
  getStatusClass(): string {
    const estado = this.reporte()?.estado;
    if (estado === 'PENDIENTE') return 'badge badge--pend';  
    if (estado === 'EN_PROCESO') return 'badge badge--proc';  
    if (estado === 'FINALIZADO') return 'badge badge--done';  
    return 'badge';
  }

  // Toggle mostrar selector de estado
  toggleStatusSelector() {
    this.showStatusSelector.update(v => !v);
  }

  // Cambiar el estado del reporte (solo admin)
  handleStatusChange() {
    const nuevoEstado = this.selectedStatus();
    const estadoActual = this.reporte()?.estado;

    // Si no cambió nada, solo cerrar el selector
    if (nuevoEstado === estadoActual) {
      this.showStatusSelector.set(false);
      return;
    }

    if (confirm(`¿Confirmar cambio de estado a "${this.formatStatusName(nuevoEstado)}"?`)) {
      this.reportService.updateStatus(this.id, nuevoEstado).subscribe({
        next: (reporteActualizado) => {
          alert('Estado actualizado exitosamente');
          // Actualizar el signal con el nuevo reporte
          this.reporte.set(reporteActualizado);
          this.showStatusSelector.set(false);
        },
        error: (err) => {
          console.error('Error al actualizar estado:', err);
          alert('Error al actualizar el estado');
          // Revertir al estado original
          this.selectedStatus.set(estadoActual as ReportStatus);
        }
      });
    } else {
      // Si cancela, revertir al estado original
      this.selectedStatus.set(estadoActual as ReportStatus);
    }
  }

  // Formatear nombre del estado para mostrar
  formatStatusName(status: string): string {
    return status.replace('_', ' ');
  }
}