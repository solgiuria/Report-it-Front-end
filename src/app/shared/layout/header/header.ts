import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Output para comunicar al layout que se debe abrir/cerrar el sidebar
  readonly menuToggle = output<void>();

  // Signal para controlar el dropdown del perfil
  readonly showDropdown = signal<boolean>(false);


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Obtener username del token
  getUsername(): string {
    const decoded = this.authService.getDecodedToken();
    return decoded?.sub || 'Usuario';
  }

  // Toggle dropdown
  toggleDropdown() {
    this.showDropdown.update(v => !v);
  }

  // Cerrar dropdown (cuando clickeas afuera)
  closeDropdown() {
    this.showDropdown.set(false);
  }

  // Navegar a nuevo reporte
  goToNewReport() {
    this.router.navigate(['app/reports/new']);
    this.closeDropdown();
  }

  // Navegar a perfil
  goToProfile() {
    this.router.navigate(['/app/profile']);
    this.closeDropdown();
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  // Toggle menú mobile
  onMenuToggle() {
    this.menuToggle.emit();
  }
}
