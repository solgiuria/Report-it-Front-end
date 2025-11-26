import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user-service';
import { AuthService } from '../../../core/services/auth-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  // Cargar datos del usuario
  readonly userData = toSignal(this.userService.getProfile());

  // Signal para mostrar/ocultar formulario de cambio de contraseña
  readonly showPasswordForm = signal(false);

  // Formulario de cambio de contraseña
  protected readonly passwordForm = this.formBuilder.nonNullable.group({
    contrasenaVieja: ['', [Validators.required]],
    contrasenaNueva: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]],
    confirmarContrasena: ['', [Validators.required]]
  });

  // Getters
  get contrasenaVieja() {
    return this.passwordForm.controls.contrasenaVieja;
  }

  get contrasenaNueva() {
    return this.passwordForm.controls.contrasenaNueva;
  }

  get confirmarContrasena() {
    return this.passwordForm.controls.confirmarContrasena;
  }

  // Validar que las contraseñas coincidan
  passwordsMatch(): boolean {
    const nueva = this.contrasenaNueva.value;
    const confirmar = this.confirmarContrasena.value;
    return nueva === confirmar;
  }

  // Toggle formulario de contraseña
  togglePasswordForm() {
    this.showPasswordForm.set(!this.showPasswordForm());
    if (!this.showPasswordForm()) {
      this.passwordForm.reset();
    }
  }

  // Cambiar contraseña
  handlePasswordChange() {
    if (this.passwordForm.invalid) {
      alert('Por favor completá todos los campos correctamente');
      return;
    }

    if (!this.passwordsMatch()) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (confirm('¿Confirmas que querés cambiar tu contraseña?')) {
      const { contrasenaVieja, contrasenaNueva } = this.passwordForm.getRawValue();

      this.userService.updatePassword({ contrasenaVieja, contrasenaNueva }).subscribe({
        next: () => {
          alert('Contraseña cambiada exitosamente');
          this.passwordForm.reset();
          this.showPasswordForm.set(false);
        },
        error: (err) => {
          console.error('Error al cambiar contraseña:', err);
          alert(err.error || 'Error al cambiar la contraseña');
        }
      });
    }
  }

  // Cerrar sesión
  logout() {
    if (confirm('¿Estás seguro de que querés cerrar sesión?')) {
      this.authService.logout();
      this.router.navigate(['/auth']);
    }
  }
}
