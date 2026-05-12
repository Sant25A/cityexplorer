import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  anioActual = new Date().getFullYear();

  activeSection: string | null = null;

  toggleSection(section: string) {
    this.activeSection = this.activeSection === section ? null : section;
  }
}
