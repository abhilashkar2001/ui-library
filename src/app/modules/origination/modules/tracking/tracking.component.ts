import { Component } from '@angular/core';
import { FooterServiceService } from 'app/shared/services/footer-service.service';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss'],
})
export class TrackingComponent {
  constructor(private footerService: FooterServiceService) {
    this.footerService.updateHideFooter(true);
  }
}
