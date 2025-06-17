import { Component, OnDestroy, OnInit } from '@angular/core';
import { ThemeService } from 'app/shared/services/theme.service';
import { IdleTimeoutService } from '@onerumango/utils';

@Component({
  selector: 'app-admin-layout',
  styleUrls: ['./admin-layout.component.scss'],
  templateUrl: './admin-layout.template.html',
})
export class AdminLayoutComponent implements OnDestroy, OnInit {
  constructor(
    public themeService: ThemeService,
    private idleTimeoutService: IdleTimeoutService,
  ) {}

  ngOnInit() {
    console.log(this.idleTimeoutService.getElapsedSessionTime());
  }

  ngOnDestroy() {
    this.idleTimeoutService.clearTimeOut();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
