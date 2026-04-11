import { Component, OnInit, inject } from '@angular/core'; // Añadimos OnInit e inject
import { CommonModule } from '@angular/common';
import { PlaceCard } from '../../../../shared/components/place-card/place-card';
import { ApiService } from '../../../../core/services/api.service'; // Importamos tu nuevo servicio

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PlaceCard], 
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit { // Implementamos OnInit
  // Usamos inject que es más moderno para Angular 17/18
  private api = inject(ApiService);

  places = [
    { id: 1, name: "Cafetería punta del cielo", location: "Tollocan", image: "https://picsum.photos/300/200?1", rating: 4.5 },
    { id: 2, name: "Alameda central", location: "Toluca Centro", image: "https://picsum.photos/300/200?2", rating: 4.7 },
    { id: 3, name: "Centro Tolzú", location: "Toluca Centro", image: "https://picsum.photos/300/200?3", rating: 4.8 }
  ];

  ngOnInit() {
    console.log('🚀 Iniciando prueba de conexión...');
    
    // Llamada a la ruta que configuramos en el backend: /api/places
    this.api.get('places').subscribe({
      next: (res) => {
        console.log('✅ ¡Conexión exitosa! Respuesta del backend:', res);
      },
      error: (err) => {
        console.error('❌ Error en la conexión:', err);
      }
    });
  }

  onToggleFavorite(place: any) {
    place.isFavorite = !place.isFavorite;
  }
}