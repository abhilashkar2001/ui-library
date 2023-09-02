import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { NewDepositService } from "app/views/home/new-deposit/new-deposit.service";

@Component({
  selector: "app-maturity-calculator",
  templateUrl: "./maturity-calculator.component.html",
  styleUrls: ["./maturity-calculator.component.scss"],
})
export class MaturityCalculatorComponent implements OnInit {
  @Input() fdName;
  constructor(private router: Router, private showSideBar: NewDepositService) {}

  ngOnInit(): void {}

  openFD(fdType) {
    var path = "";
    if (fdType == "FD") {
      path = "deposits/home/fdFlow/fdDetails";
    } else {
      console.log(fdType);
      path = "deposits/home/rdDeposit";
    }
    const fullUrl = this.router.createUrlTree([path]).toString();
    window.open(fullUrl, "_blank");
  }
}
