import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';
import { forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private api: ApiService) {}

  getPlaces(params: any = {}): Observable<any> {
    const places$ = this.api.get('places', params);

    // Si no hay token, mapeamos normal
    if (!localStorage.getItem('token')) {
      return places$.pipe(
        map((res: any) => ({
          ...res,
          places: res.places.map((p: any) => this.mapPlace(p)),
        })),
      );
    }

    // Si hay token, cruzamos con favoritos
    return forkJoin({
      res: places$ as Observable<any>, // Forzamos el tipo aquí
      favIds: this.api
        .get('favorites')
        .pipe(map((r: any) => r.favorites.map((f: any) => f.place._id))),
    }).pipe(
      map(({ res, favIds }) => {
        const mappedPlaces = res.places.map((p: any) => {
          const place = this.mapPlace(p);
          place.isFavorite = favIds.includes(p._id);
          return place;
        });

        return { ...res, places: mappedPlaces };
      }),
    );
  }

  getPlaceById(id: string): Observable<any> {
    const place$ = this.api.get(`places/${id}`);

    // Si no hay token, devolvemos el lugar normal
    if (!localStorage.getItem('token')) {
      return place$.pipe(map((res: any) => this.mapPlace(res.place)));
    }

    // Si hay token, verificamos si está en favoritos
    return forkJoin({
      res: place$ as Observable<any>,
      favIds: this.api
        .get('favorites')
        .pipe(map((r: any) => r.favorites.map((f: any) => f.place._id))),
    }).pipe(
      map(({ res, favIds }) => {
        const place = this.mapPlace(res.place);
        place.isFavorite = favIds.includes(res.place._id);
        return place;
      }),
    );
  }

  createPlace(data: any) {
    // return this.api.post('places', data).pipe(map((res: any) => this.mapPlace(res.place)));
    return this.api.post('places', data).pipe(
      map((res: any) => this.mapPlace(res.place)),
    );
  }

  private mapPlace(place: any) {
    return {
      id: place._id,
      name: place.name,
      description: place.description,
      category: place.category,
      location: place.location,
      lat: place.lat || null,
      lng: place.lng || null,
      images: place.images,
      averageRating: place.averageRating,

      image: place.images?.[0] || 'https://placehold.co/600x400',
      rating: place.averageRating || 0,
      isFavorite: false,
    };
  }
}
