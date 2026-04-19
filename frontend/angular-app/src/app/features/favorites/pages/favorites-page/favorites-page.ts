import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-favorites-page',
  imports: [CommonModule, PlaceCard, RouterModule],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export class FavoritesPage {

  favorites = [
    {
      id: 2,
      name: "Parque México",
      location: "CDMX",
      rating: 4.7,
      image: "https://picsum.photos/400/300?2",
      isFavorite: true
    },
    {
      id: 3,
      name: "Museo Frida Kahlo",
      location: "CDMX",
      rating: 4.8,
      image: "https://picsum.photos/400/300?3",
      isFavorite: true
    }
  ];

  onToggleFavorite(place: any) {
    place.isFavorite = !place.isFavorite;

    // Si se quita de favoritos → desaparece de la lista
    this.favorites = this.favorites.filter(p => p.isFavorite);
  }

}