import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core'; // Importamos signal
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PlaceService } from '../../../../core/services/place.service';
import { Router } from '@angular/router';

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
    location: ['', Validators.required],
    // Quitamos 'image' y 'lat/lng' de aquí para que el form sea válido sin ellas
  });

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files) return;

    if (this.images().length >= this.MAX_IMAGES) {
      alert(`Máximo ${this.MAX_IMAGES} imágenes permitidas`);
      this.resetFileInput(); // Limpiamos el input si excedió
      return;
    }

    const remainingSlots = this.MAX_IMAGES - this.images().length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.update((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // IMPORTANTE: Limpiamos el valor del input para permitir seleccionar el mismo archivo después
    this.resetFileInput();
  }

  // Función auxiliar para resetear el input de archivos
  private resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  removeImage(index: number) {
    this.images.update((prev) => prev.filter((_, i) => i !== index));
  }

  onSubmit() {
    if (this.form.invalid || this.loading) return;

    this.loading = true;

    // Aquí mandamos el arreglo de la señal (vaciándolo si no quieres probar fotos aún)
    const payload = {
      ...this.form.getRawValue(),
      images: [], // <-- Lo dejamos vacío de momento como pediste
      lat: null,
      lng: null,
    };

    this.placeService.createPlace(payload).subscribe({
      next: (place) => {
        this.router.navigate(['/places', place.id]);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Hubo un error al crear el lugar. Revisa la consola.');
      },
    });
  }
}
