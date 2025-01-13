import { Component, OnDestroy } from '@angular/core';
import { ThemeService } from 'app/shared/services/theme.service';
import { IdleTimeoutService } from '@onerumango/utils';
@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html',
})
export class AdminLayoutComponent implements OnDestroy {
  constructor(
    public themeService: ThemeService,
    private idleTimeoutService: IdleTimeoutService,
  ) {}

  ngOnDestroy() {
    this.idleTimeoutService.clearTimeOut();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
