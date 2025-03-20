import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-profile',
  templateUrl: './landing-profile.component.html',
  styleUrls: ['./landing-profile.component.scss'],
})
export class LandingProfileComponent {
  @Input() imageUrl: any;
  @Input() profileHint: any;
  @Input() profileHeader: any;
  @Input() routeUrl: any;
  @Output() customApply = new EventEmitter<any>();

  constructor(private router: Router) {}

  onApply(e: any) {
    this.customApply.emit(e);
  }

  navigateTracking() {
    this.router.navigate([`origination/tracking`]);
  }
}
