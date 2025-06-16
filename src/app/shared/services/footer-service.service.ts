import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FooterServiceService {
  private isVisible = new BehaviorSubject<any>(false);

  isHideFooter() {
    return this.isVisible.asObservable();
  }

  updateHideFooter(token: any) {
    this.isVisible.next(token);
  }
}
