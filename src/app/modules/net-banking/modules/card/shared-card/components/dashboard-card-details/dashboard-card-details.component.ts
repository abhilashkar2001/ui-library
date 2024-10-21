import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CardModel, HeaderModel } from "app/shared/models/card.model";
import { IconService } from "app/shared/services/icon.service";
@Component({
  selector: "app-dashboard-card-details",
  templateUrl: "./dashboard-card-details.component.html",
  styleUrls: ["./dashboard-card-details.component.scss"],
})
export class DashboardCardDetailsComponent implements OnInit {
  @Input("cardInfo") cardInfo: CardModel | undefined;
  @Input("detailsItem") detailsItem: HeaderModel[] | undefined;
  constructor(private iconService: IconService, private router: Router) {
    this.iconService
      .addIconIfNotExists("reward-icon", "assets/images/reward.svg")
      .subscribe(() => {});
    this.iconService
      .addIconIfNotExists("info-icon", "assets/images/info.svg")
      .subscribe(() => {});
  }

  ngOnInit(): void {}

  payNow() {
    this.router.navigate(["/user/card/credit-card/service/payment"]);
  }
  gotoActionPage(value) {
    console.log(value);
    // if (value === "Convert to EMI") {
    //   this.router.navigate(["/card/credit-card/service/convert-to-emi"]);
    // } else if (value === "Increase") {
    //   this.router.navigate(["/card/credit-card/manage/card-usage"]);
    // }
  }
  isFunction(item: any): boolean {
    return item?.actionItem && typeof item.actionItem === "function";
  }
  goToUpgradePage() {}
}
