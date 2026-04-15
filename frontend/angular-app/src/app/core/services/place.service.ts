import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PlaceService {
  constructor(private api: ApiService) {}

  getPlaces(params: any = {}) {
    return this.api.get('places', params).pipe(
      map((res: any) => {
        return {
          ...res,
          places: res.places.map((p: any) => this.mapPlace(p)),
        };
      }),
    );
  }

  // En place.service.ts
  getPlaceById(id: string) {
    return this.api
      .get(`places/${id}`) // Sin la diagonal al inicio
      .pipe(
        map((res: any) => {
          // Imprime esto para estar 100% seguros de qué manda el backend
          console.log('Respuesta cruda del backend id:', res);
          return this.mapPlace(res.place); // Extraemos la propiedad 'place'
        }),
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
