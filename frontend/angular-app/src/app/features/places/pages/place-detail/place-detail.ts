import { Component, OnInit, signal, inject, computed } from '@angular/core'; // Importamos signal
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlaceService } from '../../../../core/services/place.service';
import { Place } from '../../../../shared/models/place.model';
import { ReviewService } from '../../../../core/services/review.service';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite.service';
import * as L from 'leaflet';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/comfirm-modal';
@Component({
  selector: 'app-place-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmModalComponent],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css',
})
export class PlaceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private placeService = inject(PlaceService);
  private reviewService = inject(ReviewService);
  private authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);
  currentUser = this.authService.getUser();
  private notify = inject(NotificationService);

  // Definimos señales
  place = signal<Place | null>(null);
  loading = signal<boolean>(true);
  selectedImage = signal<string>('');

  // Señales para reseñas
  showDeleteReviewModal = signal(false);
  reviewToDelete = signal<string | null>(null);

  reviews = signal<any[]>([]);

  newReview = {
    rating: 0,
    comment: '',
  };

  // Señal para creación de reseñas
  hasAlreadyReviewed = computed(() => {
    return this.reviews().some((review) => this.isMyReview(review));
  });

  // Edición de reseñas
  editingReviewId = signal<string | null>(null);
  editReviewData = signal<{ rating: number; comment: string }>({
    rating: 0,
    comment: '',
  });

  // Mapa
  private map: any;

  initMap(lat: number, lng: number) {
    if (this.map) return; // evita duplicados

    this.map = L.map('map').setView([lat, lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Marker FIJO (no draggable)
    L.marker([lat, lng]).addTo(this.map);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.placeService.getPlaceById(id).subscribe({
        next: (data) => {
          this.place.set(data);
          this.selectedImage.set(data.image);
          this.loadReviews(id);
          this.loading.set(false);

          const loc = data.location;
          if (loc?.lat && loc?.lng) {
            setTimeout(() => {
              this.initMap(loc.lat, loc.lng);
            }, 0);
          }
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
        this.notify.success('Reseña agregada exitosamente');
        // Limpiar formulario
        this.resetReviewForm();
      },
      error: (err) => {
        console.error('Error al crear review:', err);
        const errorMessage = err.error?.message || 'Hubo un error al enviar la reseña';
        this.notify.error(errorMessage);
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
        this.notify.error('No se pudo guardar la edición.');
      },
    });
  }

  openDeleteReviewModal(reviewId: string) {
    this.reviewToDelete.set(reviewId);
    this.showDeleteReviewModal.set(true);
  }

  confirmDeleteReview() {
    const reviewId = this.reviewToDelete();

    if (!reviewId) return;

    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.loadReviews(this.place()!.id);

        this.notify.success('Reseña eliminada');

        this.showDeleteReviewModal.set(false);
        this.reviewToDelete.set(null);
      },
      error: (err) => {
        console.error(err);
        this.notify.error('Error al eliminar la reseña.');
      },
    });
  }

  closeDeleteReviewModal() {
    this.showDeleteReviewModal.set(false);
    this.reviewToDelete.set(null);
  }

  // place-detail.ts
  toggleFavorite() {
    const currentPlace = this.place();
    if (!currentPlace) return;

    if (!this.authService.isAuthenticated()) {
      this.notify.error('Debes iniciar sesión para marcar como favorito');
      window.location.href = '/login';
      return;
    }

    this.favoriteService.toggleFavorite(currentPlace.id).subscribe({
      next: (res) => {
        // Actualizamos la señal con el nuevo estado que devuelve el backend
        this.place.set({
          ...currentPlace,
          isFavorite: res.isFavorite,
        });
      },
      error: (err) => {
        console.error('Error toggle favorito:', err);
        this.notify.error('Error al marcar como favorito');
      },
    });
  }
}
