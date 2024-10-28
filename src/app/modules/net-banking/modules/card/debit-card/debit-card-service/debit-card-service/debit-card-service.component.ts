import { Component, OnInit } from "@angular/core";
import { DebitCardStore } from "../../debit-card.store";
import { TabModel, Tabs } from "app/shared/models/tab-model";
import { BlockCardComponent } from "../../../shared-card/components/block-card/block-card.component";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-debit-card-service",
  templateUrl: "./debit-card-service.component.html",
  styleUrls: ["./debit-card-service.component.scss"],
})
export class DebitCardServiceComponent implements OnInit {
  tabs: Tabs = DebitCardStore.serviceTabs;
  activatedComponent!: BlockCardComponent;
  tabname: string = "";
  selectedTab: TabModel | undefined;
  transactionCard = DebitCardStore.quickLinks;
  serviceLinks = DebitCardStore.Links;
  constructor(private router: Router) {}

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
