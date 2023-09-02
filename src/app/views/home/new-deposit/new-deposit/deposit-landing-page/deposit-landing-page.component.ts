import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-deposit-landing-page",
  templateUrl: "./deposit-landing-page.component.html",
  styleUrls: ["./deposit-landing-page.component.scss"],
})
export class DepositLandingPageComponent implements OnInit {
  depositName = "fdCalculator";
  title = "My first AGM project";
  lat = 51.678418;
  lng = 7.809007;
  constructor(private router: Router) {}

  ngOnInit(): void {}
  customDepositChange(event) {
    this.depositName = event;
  }
}
