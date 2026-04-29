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

  files: File[] = [];
  previewImages = signal<string[]>([]);

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
  });

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
    formData.append('location', this.form.value.location!);

    // Archivos
    this.files.forEach((file) => {
      formData.append('images', file);
    });

    this.placeService.createPlace(formData).subscribe({
      next: (place) => {
        this.router.navigate(['/places', place.id]);
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Hubo un error al crear el lugar');
      },
    });
  }
}
