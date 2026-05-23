import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  // Temas
  temaActual = signal<'cityexplorerlight' | 'cityexplorerdark'>('cityexplorerlight');

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  constructor(
    public auth: AuthService,
    private router: Router,
  ) {}

  get isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  get user() {
    return this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Cambio de temas
  ngOnInit() {
    // 1. Al cargar la app, revisamos si el usuario ya tenía un tema guardado
    const temaGuardado = localStorage.getItem('theme') as 'cityexplorerlight' | 'cityexplorerdark';

    if (temaGuardado) {
      this.temaActual.set(temaGuardado);
    } else {
      // Si no hay nada guardado, podemos revisar la preferencia del sistema operativo
      const prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.temaActual.set(prefiereOscuro ? 'cityexplorerdark' : 'cityexplorerlight');
    }

    // 2. Aplicamos el tema inicial al documento
    this.aplicarTema(this.temaActual());
  }

  // Función para alternar el interruptor (Toggle)
  toggleTema() {
    const nuevoTema =
      this.temaActual() === 'cityexplorerlight' ? 'cityexplorerdark' : 'cityexplorerlight';
    this.temaActual.set(nuevoTema);
    localStorage.setItem('theme', nuevoTema); // Lo recordamos
    this.aplicarTema(nuevoTema);
  }

  // Manipulamos directamente el atributo de la etiqueta html
  private aplicarTema(tema: string) {
    document.documentElement.setAttribute('data-theme', tema);
  }
}
