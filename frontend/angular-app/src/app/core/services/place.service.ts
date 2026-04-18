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

  getPlaceById(id: string) {
    return this.api
      .get(`places/${id}`) 
      .pipe(
        map((res: any) => {
          console.log('Respuesta cruda del backend id:', res);
          return this.mapPlace(res.place);
        }),
      );
  }

  createPlace(data: any) {
    return this.api.post('places', data).pipe(
      map((res: any) => this.mapPlace(res.place))
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
