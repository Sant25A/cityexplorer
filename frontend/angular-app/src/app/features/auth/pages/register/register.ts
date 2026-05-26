import { Component, inject, signal } from '@angular/core';
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
import { NotificationService } from '../../../../core/services/notification.service';
import { RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RecaptchaModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);
  captchaToken: string | null = null;

  // Signals para ver/ocultar contraseñas
  mostrarPassword = signal<boolean>(false);
  mostrarConfirmPassword = signal<boolean>(false);

  submitted = false;

  form = this.fb.nonNullable.group(
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

  resolvedCaptcha(token: string | null) {
    this.captchaToken = token;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) return;

    const { username, email, password } = this.form.getRawValue();

    if (!this.captchaToken) {
      this.notify.error('Completa el captcha');
      return;
    }

    this.auth.register({ username, email, password, captcha: this.captchaToken } as any).subscribe({
      next: () => {
        console.log('Registro exitoso');
        this.notify.success('¡Registro exitoso! Por favor, inicia sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro:', err);
        this.notify.error('Error al registrar usuario');
      },
    });
  }
}
