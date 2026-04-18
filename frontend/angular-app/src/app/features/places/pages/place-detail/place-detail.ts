import { Component, OnInit, signal, inject, computed } from '@angular/core'; // Importamos signal
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../../../core/services/place.service';
import { Place } from '../../../../shared/models/place.model';
import { ReviewService } from '../../../../core/services/review.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css',
})
export class PlaceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private placeService = inject(PlaceService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  currentUser = this.authService.getUser();

  // Definimos señales
  place = signal<Place | null>(null);
  loading = signal<boolean>(true);
  selectedImage = signal<string>('');

  reviews = signal<any[]>([]);

  newReview = {
    rating: 0,
    comment: '',
  };

  // Señal para creación de reseñas
  hasAlreadyReviewed = computed(() => {
    return this.reviews().some(review => this.isMyReview(review))
  });

  // Edición de reseñas
  editingReviewId = signal<string | null>(null);
  editReviewData = signal<{ rating: number; comment: string }>({
    rating: 0,
    comment: '',
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.placeService.getPlaceById(id).subscribe({
        next: (data) => {
          this.place.set(data);
          this.selectedImage.set(data.image);
          this.loadReviews(id);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error:', err);
          this.loading.set(false);
        },
      });
    }
  }

  loadReviews(placeId: string) {
    this.reviewService.getReviewsByPlace(placeId).subscribe({
      next: (reviews) => {
        const sorted = reviews.sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        this.reviews.set(sorted);

        this.placeService.getPlaceById(placeId).subscribe((data) => {
          this.place.set(data);
        });
      },
      error: (err) => console.error('Error cargando reviews:', err),
    });
  }

  isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  addReview() {
    const place = this.place();
    if (!place) return;

    if (!this.newReview.comment || this.newReview.rating === 0) return;

    const payload = {
      placeId: place.id,
      rating: this.newReview.rating,
      comment: this.newReview.comment,
    };

    this.reviewService.createReview(payload).subscribe({
      next: (review) => {
        const currentUser = this.authService.getUser();
        const reviewWithUser = {
          ...review,
          user: {
            id: currentUser?.id || currentUser?.id || 'unknown',
            username: currentUser?.username || 'Anónimo',
          },
        };

        // Actualizar listado de reseñas
        this.reviews.set([reviewWithUser, ...this.reviews()]);

        // Cálculo dinámico
        const totalReviews = this.reviews().length;
        let newAvg: number;

        if (totalReviews === 1) {
          newAvg = payload.rating;
        } else {
          newAvg = (place.rating * (totalReviews - 1) + payload.rating) / totalReviews;
        }

        this.place.set({ ...place, rating: Number(newAvg.toFixed(1)) });

        // Limpiar formulario
        this.resetReviewForm();
      },
      error: (err) => {
        console.error('Error al crear review:', err);
        const errorMessage = err.error?.message || 'Hubo un error al enviar la reseña';
        alert(errorMessage);
        this.resetReviewForm();
      },
    });
  }

  private resetReviewForm() {
    this.newReview = { rating: 0, comment: '' };
  }

  isMyReview(review: any): boolean {
    if (!review.user || !this.currentUser) return false;
    // Comparamos el ID del usuario de la reseña con el ID del usuario logueado
    const reviewUserId = review.user._id || review.user.id;
    const currentUserId = this.currentUser._id || this.currentUser.id;

    return reviewUserId?.toString() === currentUserId?.toString();
  }

  startEdit(review: any) {
    this.editingReviewId.set(review._id);
    this.editReviewData.set({
      rating: review.rating,
      comment: review.comment,
    });
  }

  saveEdit(reviewId: string) {
    const data = this.editReviewData();
    if (!data.comment.trim() || data.rating === 0) return;

    this.reviewService.updateReview(reviewId, data).subscribe({
      next: () => {
        this.loadReviews(this.place()!.id);
        this.editingReviewId.set(null);
      },
      error: (err) => {
        console.error('Error al editar:', err);
        alert('No se pudo guardar la edición.');
      },
    });
  }

  deleteReview(reviewId: string) {
    if (!confirm('¿Eliminar reseña?')) return;

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.loadReviews(this.place()!.id);
      },
      error: (err) => console.error(err),
    });
  }

  toggleFavorite() {
    const currentPlace = this.place();
    if (currentPlace) {
      this.place.set({
        ...currentPlace,
        isFavorite: !currentPlace.isFavorite,
      });
    }
  }
}
