import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-place-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './place-detail.html',
  styleUrl: './place-detail.css',
})
export class PlaceDetail {
  constructor(private route: ActivatedRoute) {}
  place = {
    id: 1,
    name: 'Café Central',
    location: 'CDMX',
    description: 'Un lugar increíble para disfrutar café de especialidad en un ambiente acogedor.',
    rating: 4.6,
    image: 'https://picsum.photos/800/400?1',
    isFavorite: false,
  };

  reviews = [
    {
      user: 'Ana',
      rating: 5,
      comment: 'Excelente lugar, muy recomendado',
    },
    {
      user: 'Luis',
      rating: 4,
      comment: 'Buen ambiente, pero algo lleno',
    },
  ];

  newReview = {
    rating: 0,
    comment: '',
  };

  toggleFavorite() {
    this.place.isFavorite = !this.place.isFavorite;
  }

  addReview() {
    if (!this.newReview.comment || this.newReview.rating === 0) return;

    this.reviews.push({
      user: 'Usuario',
      rating: this.newReview.rating,
      comment: this.newReview.comment,
    });

    this.newReview = { rating: 0, comment: '' };
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID del lugar:', id);
  }
}
