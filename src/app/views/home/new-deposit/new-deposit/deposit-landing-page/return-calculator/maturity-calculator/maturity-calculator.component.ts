import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NewDepositService } from "app/views/home/new-deposit/new-deposit.service";
import { Location } from "@angular/common";
@Component({
  selector: "app-maturity-calculator",
  templateUrl: "./maturity-calculator.component.html",
  styleUrls: ["./maturity-calculator.component.scss"],
})
export class MaturityCalculatorComponent implements OnInit {
  @Input() fdName;
  constructor(
    private router: Router,
    private showSideBar: NewDepositService,
    private location: Location
  ) {}

  ngOnInit(): void {}

  openLink(fdType) {
    let path;
    if (fdType == "FD") {
      path = "/deposits/fdFlow/fdDetails";
    } else {
      path = "/deposits/rdDeposit";
    }

    const url = this.location.prepareExternalUrl(
      this.router.serializeUrl(this.router.createUrlTree([path]))
    );

    window.open(url, "_blank");

  }
}
