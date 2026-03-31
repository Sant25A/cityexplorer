import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-place-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './place-card.html',
  styleUrl: './place-card.css',
})
export class PlaceCard {
  @Input() place: any;

  @Output() toggleFavorite = new EventEmitter<any>();

  onToggleFavorite() {
    this.toggleFavorite.emit(this.place);
  }
}
