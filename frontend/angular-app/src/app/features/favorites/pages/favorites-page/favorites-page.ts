import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, PlaceCard, RouterModule],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export class FavoritesPage implements OnInit {
  private authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);

  favorites = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      window.location.href = '/login';
      return;
    }
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        this.favorites.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      },
    });
  }

  onToggleFavorite(place: any) {
    const placeId = place.id || place._id;
    
    if (place.isFavorite === false) {
      // Si el card nos avisa que ahora es false, lo quitamos de la señal
      this.favorites.update((prev) => prev.filter((p) => (p.id || p._id) !== placeId));
    }
  }
}
