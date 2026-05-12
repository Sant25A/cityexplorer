import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
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
}
