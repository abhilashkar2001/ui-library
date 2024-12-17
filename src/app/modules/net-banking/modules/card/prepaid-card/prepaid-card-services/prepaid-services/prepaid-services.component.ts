import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PaymentComponent } from '../../../credit-card/credit-card-service/components/payment/payment.component';
import { TabModel, Tabs } from 'app/shared/models/tab-model';
import { IconService } from 'app/shared/services/icon.service';
import { filter } from 'rxjs/operators';
import { PrepaidCardStore } from '../../prepaid-card.store';

@Component({
  selector: 'app-prepaid-services',
  templateUrl: './prepaid-services.component.html',
  styleUrls: ['./prepaid-services.component.scss'],
})
export class PrepaidServicesComponent implements OnInit {
  tabs: Tabs = PrepaidCardStore.prepaidCardTab;
  activatedComponent!: PaymentComponent;
  tabname: string | any = '';
  selectedTab: TabModel | undefined;
  constructor(
    private router: Router,
    private iconService: IconService,
  ) {
    this.iconService
      .addIconIfNotExists('feather-info', 'assets/images/svg/feather-info.svg')
      .subscribe((exists) => {
        if (exists) {
          console.log(`Icon arrow-back already exists.`);
        } else {
          console.log(`Icon arrow-back was added.`);
        }
      });
  }

  ngOnInit(): void {
    let route = this.router.url;
    this.selectedRoute(route);
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ), // Type guard
      )
      .subscribe((event: NavigationEnd) => {
        route = event.urlAfterRedirects;
        this.selectedRoute(route);
      });
  }
  onSelectTab(event: any) {
    this.selectedTab = event;
  }

  selectedRoute(route: any) {
    const selectedTabValue = this.tabs.filter(
      (item) => item?.route == route,
    )[0];
    this.tabname = selectedTabValue?.screenName;
  }

  onActivate(componentRef: any): void {
    this.activatedComponent = componentRef;
  }
  proceed() {
    this.activatedComponent.proceed();
  }
}
