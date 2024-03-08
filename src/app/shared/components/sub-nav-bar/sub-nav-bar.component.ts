import { Component, OnInit } from "@angular/core";
import { NETBANKING } from "app/modules/net-banking/net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.constant";

@Component({
  selector: "app-sub-nav-bar",
  templateUrl: "./sub-nav-bar.component.html",
  styleUrls: ["./sub-nav-bar.component.scss"],
})
export class SubNavBarComponent implements OnInit {
  navigationItems = NETBANKING.navigationItems;

  constructor() {}

  ngOnInit(): void {}
}
