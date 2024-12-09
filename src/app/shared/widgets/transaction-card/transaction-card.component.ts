import { Component, Inject, Input, OnInit, Optional } from "@angular/core";
import { Router } from "@angular/router";
import { TransactionCardConstant } from "./transaction-card.constants";
import { IconService } from "app/shared/services/icon.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-transaction-card",
  templateUrl: "./transaction-card.component.html",
  styleUrls: ["./transaction-card.component.scss"]
})
export class TransactionCardComponent implements OnInit {
  @Input("transactionList") transactionList: any =
    TransactionCardConstant.transactionCard;
  selectedTab: any;
  constructor(
    private iconService: IconService,
    private router: Router,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    @Optional() private dialogRef: MatDialogRef<TransactionCardComponent>,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.selectedTab = this.data[0];
      this.addSvgIcon(this.selectedTab?.childTab);
    } else if (this.transactionList?.length > 0) {
      this.selectedTab = this.transactionList[0];
      this.addSvgIcon(this.selectedTab?.childTab);
    }
  }

  /**
   * Add svg icon to mat icon registry, if it is not present in mat icon registry
   */
  addSvgIcon(item: any) {
    item.forEach((item: any) => {
      this.iconService
        .addIconIfNotExists(item?.icon, item?.src)
        .subscribe((exists) => {
          if (exists) {
            console.log(`Icon ${item?.icon} already exists.`);
          } else {
            console.log(`Icon ${item?.icon} was added.`);
          }
        });

      this.iconService
        .addIconIfNotExists(item?.selectedIcon, item?.selectedSrc)
        .subscribe((exists) => {
          if (exists) {
            console.log(`Icon ${item?.selectedIcon} already exists.`);
          } else {
            console.log(`Icon ${item?.selectedIcon} was added.`);
          }
        });
    });
  }

  /**
   * On click on any quick link it will navigate to that particular screen
   * @param route route of the quick link
   */
  route(route: string) {
    console.log(route, "callingg");

    this.router.navigate([route]).then((_) => {
      console.log(route, "checkkkkk");
      if (this.dialogRef) this.dialogRef.close();
    });
  }

  navigate(route: string, screenName: string) {
    console.log(route, "22");
    console.log(screenName, "screennamee");
    if (screenName == "Tracking")
      window.open(
        `${route}?route=tracking&code=${this.tokenStorageService.getToken()}`
      );
    else window.open(route);
  }
}
