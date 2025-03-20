import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelpCenterService {
  private isOpen = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpen.asObservable();

  toggleHelpCenter() {
    const currentState = this.isOpen.getValue();
    console.log('Toggling Help Center:', !currentState);
    this.isOpen.next(!currentState);
  }

  closeHelpCenter() {
    this.isOpen.next(false); // ✅ Always sets it to closed
  }
}
