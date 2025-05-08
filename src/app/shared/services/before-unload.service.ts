import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BeforeUnloadService {
  private enableWarning = false;

  enable(): void {
    if (!this.enableWarning) {
      window.addEventListener('beforeunload', this.beforeUnloadListener);
      this.enableWarning = true;
    }
  }

  disable(): void {
    if (this.enableWarning) {
      window.removeEventListener('beforeunload', this.beforeUnloadListener);
      this.enableWarning = false;
    }
  }

  private beforeUnloadListener(event: BeforeUnloadEvent): string {
    const confirmationMessage =
      'Are you sure you want to leave? Unsaved changes might be lost.';
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }
}
