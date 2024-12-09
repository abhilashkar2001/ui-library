import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NETBANKING } from "app/modules/net-banking/modules/dashboard/net-banking-dashboard/net-banking-dashboard.constant";

@Component({
  selector: "app-sub-nav-bar",
  templateUrl: "./sub-nav-bar.component.html",
  styleUrls: ["./sub-nav-bar.component.scss"]
})
export class SubNavBarComponent implements OnInit {
  navigationItems = NETBANKING.navigationItems;

  activeItem = "";

  constructor(private route: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  navigateByUrl(url: any) {
    if (url?.link) {
      this.activeItem = url.label;
      this.cdr.detectChanges();
      this.route.navigate([`${url.link}`]);
    }
  }
}
