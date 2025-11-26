import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../../core/services/user-service';


@Component({
  selector: 'app-user-detail-page',
  standalone: true,
  imports: [],
  templateUrl: './user-detail-page.html',
  styleUrl: './user-detail-page.css',
})
export class UserDetailPage {
  
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  // Obtener el ID desde la ruta
  readonly userId = Number(this.route.snapshot.paramMap.get('id'));
  
  // Cargar el usuario
  readonly user = toSignal(this.userService.getUserById(this.userId));

  // Volver a la lista
  goBack() {
    this.router.navigate(['/app/admin/users']);
  }

  // Eliminar usuario
  handleDelete() {
    const user = this.user();
    if (!user) return;

    if (confirm(`¿Estás seguro de eliminar al usuario "${user.nombre} ${user.apellido}"?\n\nEsta acción no se puede deshacer.`)) {
      this.userService.deleteUser(this.userId).subscribe({
        next: () => {
          alert('Usuario eliminado exitosamente');
          this.router.navigate(['/app/admin/users']);
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }
}