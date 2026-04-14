import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';
import { PlaceService } from '../../../../core/services/place.service';
import { Place } from '../../../../shared/models/place.model';

@Component({
  selector: 'app-places-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PlaceCard],
  templateUrl: './places-list.html',
  styleUrl: './places-list.css',
})
export class PlacesList {
  private placeService = inject(PlaceService);
  private cdr = inject(ChangeDetectorRef);

  // Variables para filtros
  search = '';
  selectedCity = '';
  selectedCategory = '';

  places: Place[] = [];
  loading = true;

  ngOnInit() {
    this.fetchPlaces();
  }

  fetchPlaces() {
    this.loading = true;

    const params: any = {
      search: this.search,
      location: this.selectedCity,
      category: this.selectedCategory,
    };

    this.placeService.getPlaces(params).subscribe({
      next: (res) => {
        console.log('✅ Datos recibidos en PlacesList:', res.places);
        this.places = res.places;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching places:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  applyFilters() {
    this.fetchPlaces();
  }

  onToggleFavorite(place: any) {
    place.isFavorite = !place.isFavorite;
  }
}
