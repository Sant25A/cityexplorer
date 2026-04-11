import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);

  submitted = false;

  form = this.fb.nonNullable.group(
    // <-- Agregamos .nonNullable
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    {
      validators: this.passwordMatchValidator,
    },
  );

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    // Con getRawValue() obtenemos los valores con el tipo correcto (string)
    const { username, email, password } = this.form.getRawValue();

    this.auth.register({ username, email, password }).subscribe({
      next: () => {
        console.log('Registro exitoso 🚀');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error registro:', err);
        alert('Error al registrar usuario');
      },
    });
  }
}
