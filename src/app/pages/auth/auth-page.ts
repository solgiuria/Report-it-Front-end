import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthForm } from './components/auth-form/auth-form';
import { AuthService } from '../../core/services/auth-service';
import { LoginRequest, RegisterRequest } from '../../models/auth';



@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule,AuthForm],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly mode = signal<'login' | 'register'>('login');

  toggleMode() {
    this.auth.logout();   //  limpia cualquier token antes de cambiar modo
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
  }


  handleEvent(formData: LoginRequest | RegisterRequest) {
    if (this.mode() === 'login') {
      const data = formData as LoginRequest;
      this.auth.login(data).subscribe({
        next: (res) => {
          this.auth.saveToken(res.token);
          this.router.navigateByUrl('/app/reports');
        },
        error: () => alert('Error al iniciar sesión')
      });
    } else {
      const data = formData as RegisterRequest;
      this.auth.register(data).subscribe({
        next: () => {
          alert('Usuario registrado correctamente');
          this.toggleMode();
        },
        error: () => alert('Error al registrar usuario')
      });
    }
  }


}
