import { Component, OnInit, inject, signal } from '@angular/core'; // Cambiamos ChangeDetectorRef por signal
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
export class PlacesList implements OnInit {
  private placeService = inject(PlaceService);

  // Señales para filtros
  search = signal<string>('');
  selectedCity = signal<string>('');
  selectedCategory = signal<string>('');
  sort = signal<string>('newest');
  cities = signal<string[]>([]);

  // Señales para datos y estado
  places = signal<Place[]>([]);
  loading = signal<boolean>(true);

  // Señales para paginación
  page = signal<number>(1);
  limit = signal<number>(9);
  totalPages = signal<number>(1);

  // Tiempo de búsqueda
  searchTimeout: any;

  ngOnInit() {
    this.fetchPlaces();
    this.fetchCities();
  }

  fetchPlaces() {
    this.loading.set(true);

    const params: any = {
      page: this.page(),
      limit: this.limit(),
      sort: this.sort(),
    };

    if (this.search()) params.search = this.search();
    if (this.selectedCity()) params.location = this.selectedCity();
    if (this.selectedCategory()) params.category = this.selectedCategory();

    this.placeService.getPlaces(params).subscribe({
      next: (res) => {
        this.places.set(res.places || []);
        this.totalPages.set(res.totalPages || 1);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching places:', err);
        this.places.set([]);
        this.loading.set(false);
      },
    });
  }

  fetchCities() {
    this.placeService.getCities().subscribe({
      next: (res: any) => {
        this.cities.set(res.cities || []);
      },
      error: (err) => {
        console.error('Error fetching cities:', err);
      },
    });
  }

  applyFilters() {
    this.page.set(1);
    this.fetchPlaces();
  }

  changePage(newPage: number) {
    this.page.set(newPage);
    this.fetchPlaces();
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.applyFilters();
    }, 500);
  }

  onToggleFavorite(place: Place) {
    this.places.update((currentPlaces) => {
      return currentPlaces.map((p) => {
        if (p.id === place.id) {
          return { ...p, isFavorite: !p.isFavorite };
        }
        return p;
      });
    });
  }
}
