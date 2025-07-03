import {
  AfterViewInit,
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { IdleTimeoutService } from '@onerumango/utils';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService } from '../../shared/services/sidenav.service';

@Component({
  selector: 'app-admin-layout',
  styleUrls: ['./admin-layout.component.scss'],
  templateUrl: './admin-layout.template.html',
})
export class AdminLayoutComponent implements OnDestroy, AfterViewInit {
  @ViewChild('sidenavPanel', { static: true })
  private sidenavPanel!: MatSidenav;
  @ViewChild('sidenavContainer', { read: ViewContainerRef, static: true })
  private sidenavContainer!: ViewContainerRef;

  constructor(
    private idleTimeoutService: IdleTimeoutService,
    private sidenavService: SidenavService,
  ) {}

  ngAfterViewInit() {
    this.sidenavService.setPanel(this.sidenavPanel);
    this.sidenavService.setContainer(this.sidenavContainer);
  }

  ngOnDestroy() {
    this.idleTimeoutService.clearTimeOut();
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
