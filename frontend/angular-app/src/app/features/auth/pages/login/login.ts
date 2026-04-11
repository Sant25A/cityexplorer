import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submitted = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    // Usamos getRawValue y un "type cast" o simplemente extraemos los datos
    const loginData = {
      email: this.form.controls.email.value as string,
      password: this.form.controls.password.value as string,
    };

    this.auth.login(loginData).subscribe({
      next: () => {
        console.log('Login exitoso 🚀');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        // NOTA: Cambiar más adelante por algo más visual 
        alert('Credenciales incorrectas o error del servidor');
      },
    });
  }
}
