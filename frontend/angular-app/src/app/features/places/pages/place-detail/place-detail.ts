import { Component, OnInit, signal, inject } from '@angular/core'; // Importamos signal
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../../../core/services/place.service';
import { Place } from '../../../../shared/models/place.model';

@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css',
})
export class PlaceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private placeService = inject(PlaceService);

  // Definimos señales
  place = signal<Place | null>(null);
  loading = signal<boolean>(true);
  selectedImage = signal<string>('');

  reviews = signal<any[]>([]); 

  newReview = {
    rating: 0,
    comment: '',
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.placeService.getPlaceById(id).subscribe({
        next: (data) => {
          // Actualizamos los valores usando .set()
          this.place.set(data);
          this.selectedImage.set(data.image);
          this.loading.set(false);
          // ¡YA NO NECESITAS cdr.detectChanges()!
        },
        error: (err) => {
          console.error('Error:', err);
          this.loading.set(false);
        },
      });
    }
  }

  addReview() {
    if (!this.newReview.comment || this.newReview.rating === 0) return;

    this.reviews.set([
      ...this.reviews(),
      {
        user: 'Usuario',
        rating: this.newReview.rating,
        comment: this.newReview.comment,
      }
    ]);

    this.newReview = { rating: 0, comment: '' };
  }

  toggleFavorite() {
    const currentPlace = this.place();
    if (currentPlace) {
      this.place.set({
        ...currentPlace,
        isFavorite: !currentPlace.isFavorite
      });
    }
  }
}