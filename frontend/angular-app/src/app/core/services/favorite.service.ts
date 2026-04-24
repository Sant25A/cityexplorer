import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  constructor(private api: ApiService) {}

  toggleFavorite(placeId: string) {
    return this.api.post('favorites', { placeId }).pipe(map((res: any) => res));
  }

  getFavorites() {
    return this.api.get('favorites').pipe(
      map((res: any) =>
        res.favorites.map((f: any) => ({
          ...f.place,
          id: f.place._id, // Forzamos id sin guion bajo aquí
          isFavorite: true,
          image: f.place.images?.[0] || 'https://placehold.co/600x400',
          rating: f.place.averageRating || 0,
        })),
      ),
    );
  }

  getFavoriteIds() {
    return this.api
      .get('favorites')
      .pipe(map((res: any) => res.favorites.map((f: any) => f.place._id)));
  }
}
