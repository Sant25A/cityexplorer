import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core'; // Importamos signal
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PlaceService } from '../../../../core/services/place.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
// Fix para los iconos de Leaflet en Angular
const iconRetinaUrl = 'leaflet/marker-icon-2x.png';
const iconUrl = 'leaflet/marker-icon.png';
const shadowUrl = 'leaflet/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;
@Component({
  selector: 'app-create-place',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-place.html',
  styleUrl: './create-place.css',
})
export class CreatePlace {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private placeService = inject(PlaceService);
  private router = inject(Router);

  // Lugares creados por el usuario
  myPlaces = signal<any[]>([]);
  loadingMyPlaces = signal<boolean>(false);

  files: File[] = [];
  previewImages = signal<string[]>([]);

  // Variables para mapa
  map!: L.Map;
  marker!: L.Marker;

  selectedLat = signal<number | null>(null);
  selectedLng = signal<number | null>(null);
  selectedAddress = signal<string>('');
  selectedCity = signal<string>('');

  categories = [
    'cafe',
    'restaurante',
    'parque',
    'bar',
    'museo',
    'hotel',
    'tienda',
    'atraccion',
    'naturaleza',
    'otro',
  ];

  // Usamos una Signal para las imágenes: instantáneo y automático
  images = signal<string[]>([]);
  readonly MAX_IMAGES = 5;

  loading = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    // location: ['', Validators.required],
  });

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([19.2826, -99.6557], 13); // Toluca default

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;

      this.setMarker(lat, lng);
      this.reverseGeocode(lat, lng);
    });
  }

  setMarker(lat: number, lng: number) {
    this.selectedLat.set(lat);
    this.selectedLng.set(lng);

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  reverseGeocode(lat: number, lng: number) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        this.selectedAddress.set(data.display_name || 'Dirección no encontrada');
        this.selectedCity.set(
          data.address?.city || data.address?.town || data.address?.village || 'Sin ciudad',
        );
      })
      .catch(() => {
        this.selectedAddress.set('Error obteniendo dirección');
      });
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        this.map.setView([lat, lng], 15);
        this.setMarker(lat, lng);
        this.reverseGeocode(lat, lng);
      },
      () => {
        alert('No se pudo obtener ubicación');
      },
    );
  }

  ngOnInit() {
    this.loadMyPlaces();
  }

  loadMyPlaces() {
    this.loadingMyPlaces.set(true);

    this.placeService.getMyPlaces().subscribe({
      next: (places) => {
        this.myPlaces.set(places);
        this.loadingMyPlaces.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loadingMyPlaces.set(false);
      },
    });
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    if (this.previewImages().length >= this.MAX_IMAGES) {
      alert(`Máximo ${this.MAX_IMAGES} imágenes permitidas`);
      this.resetFileInput();
      return;
    }

    const remainingSlots = this.MAX_IMAGES - this.previewImages().length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      // Guardamos archivo real
      this.files.push(file);

      // Generamos preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImages.update((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    this.resetFileInput();
  }

  // Función auxiliar para resetear el input de archivos
  private resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  removeImage(index: number) {
    this.previewImages.update((prev) => prev.filter((_, i) => i !== index));
    this.files.splice(index, 1);
  }

  viewPlace(id: string) {
    this.router.navigate(['/places', id]);
  }

  onSubmit() {
    if (this.form.invalid || this.loading || this.files.length === 0) {
      if (this.files.length === 0) {
        alert('Por favor completa el formulario y agrega al menos una imagen');
      }
      return;
    }

    this.loading = true;

    const formData = new FormData();

    // Campos normales
    formData.append('name', this.form.value.name!);
    formData.append('description', this.form.value.description!);
    formData.append('category', this.form.value.category!);
    // formData.append('location', this.form.value.location!);
    if (!this.selectedLat() || !this.selectedLng()) {
      alert('Selecciona una ubicación en el mapa');
      this.loading = false;
      return;
    }

    formData.append('address', this.selectedAddress());
    formData.append('city', this.selectedCity());
    formData.append('lat', String(this.selectedLat()));
    formData.append('lng', String(this.selectedLng()));

    // Archivos
    this.files.forEach((file) => {
      formData.append('images', file);
    });

    this.placeService.createPlace(formData).subscribe({
      next: (place) => {
        this.loadMyPlaces();
        this.router.navigate(['/places', place.id]);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Hubo un error al crear el lugar');
      },
    });
  }

  deletePlace(id: string) {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este lugar?');

    if (!confirmDelete) return;

    this.placeService.deletePlace(id).subscribe({
      next: () => {
        // quitar del estado local (UX rápida 🚀)
        this.myPlaces.update((prev) => prev.filter((p) => p.id !== id));
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar');
      },
    });
  }
}
