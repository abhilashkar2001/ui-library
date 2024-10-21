import { Component, OnInit } from "@angular/core";
import { PaymentComponent } from "../components/payment/payment.component";
import { NavigationEnd, Router } from "@angular/router";
import { IconService } from "app/shared/services/icon.service";
import { TabModel, Tabs } from "app/shared/models/tab-model";
import { CreditCardStore } from "../../credit-card.store";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-credit-card-service",
  templateUrl: "./credit-card-service.component.html",
  styleUrls: ["./credit-card-service.component.scss"],
})
export class CreditCardServiceComponent implements OnInit {
  tabs: Tabs = CreditCardStore.serviceTabs;
  activatedComponent!: PaymentComponent;
  tabname: string = "";
  selectedTab: TabModel | undefined;
  constructor(private router: Router, private iconService: IconService) {
    this.iconService
      .addIconIfNotExists("feather-info", "assets/images/feather-info.svg")
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
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        route = event.urlAfterRedirects;
        this.selectedRoute(route);
      });
  }
  onSelectTab(event) {
    this.selectedTab = event;
  }

  selectedRoute(route) {
    let selectedTabValue = this.tabs.filter((item) => item?.route == route)[0];
    this.tabname = selectedTabValue?.screenName;
  }

  onActivate(componentRef: any): void {
    this.activatedComponent = componentRef;
  }
  proceed() {
    this.activatedComponent.proceed();
  }
}
