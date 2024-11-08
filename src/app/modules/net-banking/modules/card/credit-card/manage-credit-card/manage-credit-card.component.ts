import { Component, OnInit, Optional } from "@angular/core";
import { CreditCardStore } from "../credit-card.store";
import { DrawerConstant } from "app/shared/components/custom-drawer/custom-drawer.constant";
import { Router } from "@angular/router";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-manage-credit-card",
  templateUrl: "./manage-credit-card.component.html",
  styleUrls: ["./manage-credit-card.component.scss"],
})
export class ManageCreditCardComponent implements OnInit {
  transactionCard = CreditCardStore.quickLinks;
  serviceLinks = CreditCardStore.ManageLinks;
  tabs = DrawerConstant.cardMenuTabs;
  constructor(
    private router: Router,
    @Optional() private dialogRef: MatDialogRef<ManageCreditCardComponent>
  ) {}

  ngOnInit(): void {}
  route(route: string) {
    console.log(route, "callingg");

    this.router.navigate([route]).then((_) => {
      console.log(route, "checkkkkk");
      if (this.dialogRef) this.dialogRef.close();
    });
  }
}
