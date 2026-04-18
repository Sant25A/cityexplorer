import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private api: ApiService) {}

  getReviewsByPlace(placeId: string) {
    return this.api.get(`reviews/${placeId}`).pipe(map((res: any) => res.reviews));
  }

  createReview(data: { placeId: string; rating: number; comment: string }) {
    return this.api.post('reviews', data).pipe(map((res: any) => res.review));
  }

  updateReview(id: string, data: { rating: number; comment: string }) {
    return this.api.put(`reviews/${id}`, data).pipe(map((res: any) => res.review));
  }

  deleteReview(id: string) {
    return this.api.delete(`reviews/${id}`).pipe(map((res: any) => res.message));
  }
}
