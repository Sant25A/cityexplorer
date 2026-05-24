import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../../core/services/api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/comfirm-modal';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent], 
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private api = inject(ApiService);
  private notify = inject(NotificationService);

  activeTab = signal<'users' | 'places'>('users');
  loading = signal<boolean>(false);

  users = signal<any[]>([]);
  places = signal<any[]>([]);

  // Signals para el modal
  showDeleteModal = signal<boolean>(false);
  placeToDelete = signal<string | null>(null);

  ngOnInit() {
    this.loadUsers();
    this.loadPlaces();
  }

  loadUsers() {
    this.loading.set(true);
    this.api.get('admin/users').subscribe({
      next: (data: any) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  loadPlaces() {
    this.loading.set(true);
    this.api.get('admin/places').subscribe({
      next: (data: any) => {
        this.places.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  openDeleteModal(id: string) {
    this.placeToDelete.set(id);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.placeToDelete.set(null);
  }

  confirmDeletePlace() {
    const id = this.placeToDelete();
    if (!id) return;

    this.api.delete(`admin/places/${id}`).subscribe({
      next: () => {
        this.notify.success('Destino eliminado por el administrador con éxito');
        this.places.update((prev) => prev.filter((p) => p._id !== id));
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error(err);
        this.notify.error('Error al intentar eliminar el destino');
        this.closeDeleteModal();
      },
    });
  }
}