import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';

@Component({
  selector: 'app-places-list',
  imports: [CommonModule, FormsModule, PlaceCard],
  templateUrl: './places-list.html',
  styleUrl: './places-list.css',
})
export class PlacesList {
  search = '';
  selectedCity = '';
  selectedCategory = '';

  places = [
    {
      id: 1,
      name: 'Café Central',
      location: 'CDMX',
      category: 'Café',
      rating: 4.5,
      image: 'https://picsum.photos/400/300?1',
      isFavorite: false,
    },
    {
      id: 2,
      name: 'Parque México',
      location: 'CDMX',
      category: 'Parque',
      rating: 4.7,
      image: 'https://picsum.photos/400/300?2',
      isFavorite: false,
    },
    {
      id: 3,
      name: 'Museo Frida Kahlo',
      location: 'CDMX',
      category: 'Museo',
      rating: 4.8,
      image: 'https://picsum.photos/400/300?3',
      isFavorite: false,
    },
    {
      id: 4,
      name: 'Restaurante Azul',
      location: 'CDMX',
      category: 'Restaurante',
      rating: 4.6,
      image: 'https://picsum.photos/400/300?4',
      isFavorite: false,
    },
  ];

  onToggleFavorite(place: any) {
    place.isFavorite = !place.isFavorite;
  }
}
