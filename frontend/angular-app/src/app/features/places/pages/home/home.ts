import { Component, OnInit, inject, signal } from '@angular/core'; // Cambiamos ChangeDetectorRef por signal
import { PlaceService } from '../../../../core/services/place.service';
import { CommonModule } from '@angular/common';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Place } from '../../../../shared/models/place.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PlaceCard, FormsModule, RouterModule],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private placeService = inject(PlaceService);

  // Definimos nuestras señales
  places = signal<Place[]>([]);
  loading = signal<boolean>(true);
  searchTerm = signal<string>('');

  ngOnInit() {
    this.loadPlaces();
  }

  loadPlaces() {
    this.loading.set(true);
    
    const params: any = {
      limit: 6,
      sort: 'rating'
    };

    if (this.searchTerm().trim()) {
      params.search = this.searchTerm().trim();
    }

    this.placeService.getPlaces(params).subscribe({
      next: (res) => {
        this.places.set(res.places);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error en el componente:', err);
        this.loading.set(false);
      }
    });
  } 

  onSearch() {
    this.loadPlaces();
  }

  onToggleFavorite(place: Place) {
    place.isFavorite = !place.isFavorite;
  }
}