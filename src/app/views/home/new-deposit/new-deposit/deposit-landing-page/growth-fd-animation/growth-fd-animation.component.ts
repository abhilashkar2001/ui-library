import { Component, Input, OnInit } from "@angular/core";
import { NewDepositConstant } from "../../new-deposit.constant";
import { Router } from "@angular/router";

@Component({
  selector: "app-growth-fd-animation",
  templateUrl: "./growth-fd-animation.component.html",
  styleUrls: ["./growth-fd-animation.component.scss"],
})
export class GrowthFdAnimationComponent implements OnInit {
  @Input() depositName;
  fdArray = NewDepositConstant.GROWTHFD;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  openFD(fdType) {
    var path = "";
    if (fdType == "FD") {
      path = "deposits/home/fdFlow/fdDetails";
    } else {
      return;
    }
    const fullUrl = this.router.createUrlTree([path]).toString();
    window.open(fullUrl, "_blank");
  }
}
