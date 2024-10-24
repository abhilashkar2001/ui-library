import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-deposit-landing-page",
  templateUrl: "./deposit-landing-page.component.html",
  styleUrls: ["./deposit-landing-page.component.scss"],
})
export class DepositLandingPageComponent implements OnInit {
  depositName = "fdCalculator";
  fdRdName = "FD";
  fdRdFullName = "Fixed";
  title = "My first AGM project";
  lat = 51.678418;
  lng = 7.809007;
  imageUrl = "assets/images/deposit-landing-image.svg";
  profileHeader = "Secure Your Future with Guaranteed Returns.";
  profileHint =
    "A safe and accessible solution to manage your finances. Enjoy the convenience of instant access while your money grows securely. Start banking with us today and take control of your financial journey.";
  routeUrl = "";
  constructor(private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
  customDepositChange(event) {
    this.depositName = event;
    if (this.depositName == "rdCalculator") {
      this.fdRdName = "RD";
      this.fdRdFullName = "Recurring";
    } else {
      this.fdRdName = "FD";
      this.fdRdFullName = "Fixed ";
    }
  }

  apply() {
    this.router.navigate([`${this.routeUrl}`]);
  }
}
