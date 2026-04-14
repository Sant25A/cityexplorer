import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; // Agregué ChangeDetectorRef por si acaso
import { PlaceService } from '../../../../core/services/place.service';
import { CommonModule } from '@angular/common';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PlaceCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private placeService = inject(PlaceService);
  private cdr = inject(ChangeDetectorRef); // Para forzar que se pinte la pantalla

  places: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadPlaces();
  }

  loadPlaces() {
    console.log('Solicitando lugares...');
    this.placeService.getPlaces({ limit: 6, sort: 'rating' })
      .subscribe({
        next: (res) => {
          console.log('✅ Datos recibidos en el componente:', res.places);
          this.places = res.places;
          this.loading = false;
          this.cdr.detectChanges(); // Esto obliga a Angular a quitar los puntitos y poner las cards
        },
        error: (err) => {
          console.error('❌ Error en el componente:', err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  } 

  onToggleFavorite(place: any) {
    place.isFavorite = !place.isFavorite;
  }
}