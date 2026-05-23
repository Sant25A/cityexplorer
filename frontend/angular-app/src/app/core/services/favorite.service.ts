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
        res.favorites
          .filter((f: any) => f.place !== null) 
          .map((f: any) => {
            const p = f.place;

            // Normalizamos las imágenes para que coincidan con PlaceService.mapPlace
            let imagesNormalized: string[] = [];
            if (Array.isArray(p.images)) {
              imagesNormalized = p.images.map((img: any) =>
                typeof img === 'string' ? img : img.url,
              );
            }

            return {
              ...p,
              id: p._id,
              isFavorite: true,
              // Usamos la primera imagen del array normalizado o el placeholder
              image:
                imagesNormalized.length > 0 ? imagesNormalized[0] : 'https://placehold.co/600x400',
              images: imagesNormalized,
              rating: p.averageRating || 0,
            };
          }),
      ),
    );
  }

  getFavoriteIds() {
    return this.api
      .get('favorites')
      .pipe(map((res: any) => res.favorites.map((f: any) => f.place._id)));
  }
}
