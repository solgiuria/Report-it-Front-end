import { Component, effect, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest, RegisterRequest } from '../../../../models/auth';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './auth-form.html',
  styleUrl: './auth-form.css',
})
export class AuthForm {

  private readonly fb = inject(FormBuilder);

  readonly mode = input<'login' | 'register'>('login');          //el padre, auth, decide si es login o registrer pero x def es login
  readonly submitted = output<LoginRequest | RegisterRequest>();                // emite payload listo (payload es lo q va dentro del body de la request)


  private readonly syncRegisterState = effect(() => {  
    const m = this.mode();                             //aca esta la lectura reactiva (effect() es una funcion reactiva q se ejecuta automaticamente cada vez q cambia algo q se lee dentro de ella)
    const registerGroup = this.form.get('register');

    if (!registerGroup) return;
    if (m === 'login') registerGroup.disable({ emitEvent: false });
    else registerGroup.enable({ emitEvent: false });
  });



  protected readonly form = this.fb.nonNullable.group({                                              //pongo los de nro en null xq sino no se ve el placeholder del input
    register: this.fb.nonNullable.group({
      nombre:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      edad:     [null,  [Validators.required, Validators.min(18)]],
      email:    ['', [Validators.required, Validators.email]],
      dni:      [null,  [Validators.required, Validators.min(1000000)]], //mayor o igual a 1millon
    }),
    username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
  });

  get username(){return this.form.controls.username;}
  get password(){return this.form.controls.password;}
  get nombre(){return this.form.controls.register.controls.nombre;}
  get apellido(){return this.form.controls.register.controls.apellido;}  
  get edad(){return this.form.controls.register.controls.edad;}
  get dni(){return this.form.controls.register.controls.dni;}  
  get email(){return this.form.controls.register.controls.email;}


  handleSubmit() {
    if (this.mode() === 'login') {
      const u = this.form.get('username')!;
      const p = this.form.get('password')!;
      if (u.invalid || p.invalid) {
        alert('Completá usuario y contraseña válidos');
        return;
      }
      //cumple LoginRequest
      this.submitted.emit({ username: u.value, password: p.value });

    } else {
      if (this.form.invalid) {
        alert('Formulario de registro inválido');
        return;
      }

      const completeForm = this.form.getRawValue();
      //cumple RegisterRequest
      const formPlainData = {
        ...completeForm.register,
        username: completeForm.username,
        password: completeForm.password,
      }
      console.log("soy la info del form plana: ", formPlainData);
      this.submitted.emit(formPlainData);
    
    }
  this.form.reset();
}
  

}






