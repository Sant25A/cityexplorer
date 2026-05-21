import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  messages = signal<ToastMessage[]>([]);

  private show(message: string, type: ToastMessage['type']) {
    const id = Date.now();

    this.messages.update((prev) => [
      ...prev,
      { id, message, type },
    ]);

    setTimeout(() => {
      this.messages.update((prev) =>
        prev.filter((m) => m.id !== id)
      );
    }, 4000);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error');
  }

  info(message: string) {
    this.show(message, 'info');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }
}