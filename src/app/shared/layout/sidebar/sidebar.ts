import { Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Input para saber si está abierto (mobile)
  readonly isOpen = input<boolean>(false);

  // Output para cerrar el sidebar
  readonly closeSidebar = output<void>();

  // Verificar si es admin
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Obtener ID del usuario actual (para "Mis Reportes")
  getCurrentUserId(): number {
    const decoded = this.authService.getDecodedToken();
    return decoded?.userId || 0; 
  }

  // Cerrar sidebar (para mobile)
  close() {
    this.closeSidebar.emit();
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}
