import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-net-banking-home",
  templateUrl: "./net-banking-home.component.html",
  styleUrls: ["./net-banking-home.component.scss"],
})
export class NetBankingHomeComponent implements OnInit {
  private routerEventSub: Subscription;
  genericScreenName: any = "Pending for approval";
  skipPadding: boolean;
  columns = [
    {
      columnDef: "version",
      header: "Version",
      cell: (element: any) => `${element?.version}`,
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Action By",
      cell: (element: any) => `${element.lastUpdatedBy}`,
    },
  ];
  navigationItems = [
    {
      label: "Home",
      icon: "/assets/images/net-banking-nav-bar/Home_Icon.svg",
      link: "/home",
    },
    {
      label: "Fund Transfer",
      icon: "/assets/images/net-banking-nav-bar/Fund-Transfer_Icon.svg",
      link: "/fund-transfer",
    },
    {
      label: "Deposit",
      icon: "/assets/images/net-banking-nav-bar/Deposit_Icon.svg",
      link: "/deposit",
    },
    {
      label: "Cards",
      icon: "/assets/images/net-banking-nav-bar/Cards_Icon.svg",
      link: "/cards",
    },
    {
      label: "Loan",
      icon: "/assets/images/net-banking-nav-bar/Loan_Icon.svg",
      link: "/loan",
    },
    {
      label: "Summary",
      icon: "/assets/images/net-banking-nav-bar/Summary_Icon.svg",
      link: "/summary",
    },
  ];
  layout: any;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routerEventSub = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        if (routeChange.url.includes("trade")) {
          this.skipPadding = true;
        } else {
          this.skipPadding = false;
        }
      });
  }

  ngOnInit(): void {}
}
