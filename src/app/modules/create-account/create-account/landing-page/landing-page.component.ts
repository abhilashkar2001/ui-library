import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HomeService } from "app/shared/services/home-service/home.service";
@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  data: [] = [];
  imageUrl = "assets/images/Group 13740.svg";
  profileHeader = "Savings Made Simple: Open Your Account in 3 Easy Steps.";
  profileHint =
    "Supercharge your savings for a wealthier you. Say hello to financial freedom! Join now and watch your money flourish.";
  routeUrl = "/account/open";
  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.getAccountTypes();
  }

  getAccountTypes() {
    this.homeService.getAccountTypes().subscribe((response: any) => {
      this.data = response.data;
    });
  }
  customApplyLoan(event) {
    console.log(event);
    console.log("....");
    this.router.navigate(["account/applyAccount", event]);
  }
}
