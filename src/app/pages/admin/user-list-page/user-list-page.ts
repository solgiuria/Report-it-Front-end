import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user-service';


@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [],
  templateUrl: './user-list-page.html',
  styleUrl: './user-list-page.css',
})
export class UserListPage {
  
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  // DATOS DEL BACKEND
  readonly users = toSignal(this.userService.getAllUsers(), { initialValue: [] });

  // Navegar al detalle del usuario
  viewUser(userId: number) {
    this.router.navigate(['/app/admin/users', userId]);
  }
}
