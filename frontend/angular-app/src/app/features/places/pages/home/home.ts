import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PlaceCard], 
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  // Tus datos de prueba (agregué un id para el ruteo)
  places = [
    { id: 1, name: "Cafetería punta del cielo", location: "Tollocan", image: "https://picsum.photos/300/200?1", rating: 4.5 },
    { id: 2, name: "Alameda central", location: "Toluca Centro", image: "https://picsum.photos/300/200?2", rating: 4.7 },
    { id: 3, name: "Centro Tolzú", location: "Toluca Centro", image: "https://picsum.photos/300/200?3", rating: 4.8 }
  ];

  onToggleFavorite(place: any) {
    place.isFavorite = !place.isFavorite;
  }
}