import { Component, ElementRef, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { HomeService } from "app/shared/services/home-service/home.service";
import { TokenStorageService } from "app/shared/token-storage.service";
@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  data: [] = [];
  imageUrl = "assets/images/account-landing-image.svg";
  profileHeader = "Savings Made Simple: Open Your Account in 3 Easy Steps.";
  profileHint =
    "Supercharge your savings for a wealthier you. Say hello to financial freedom! Join now and watch your money flourish.";
  routeUrl = "/account/open";
  businessSuiteName: string = "ACCOUNTOPENINGSERVICES";
  constructor(
    private homeService: HomeService,
    private router: Router,
    private el: ElementRef,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getCountryCurrency();
    this.getAccountTypes();
  }

  getCountryCurrency() {
    const userBranchCode = this.tokenStore.getUser()?.branchCode;
    this.homeService
      .getCountryCurrency(userBranchCode)
      .subscribe((resp: any) => {
        if (resp?.statusCode) this.tokenStore.saveUserOtherInfo(resp.data);
      });
  }

  getAccountTypes() {
    this.homeService
      .getAccountTypes(this.businessSuiteName)
      .subscribe((response: any) => {
        if (response) this.data = response.data;
      });
  }
  customApplyLoan(event) {
    this.router.navigate(["account/applyAccount", event]);
  }
  customApply(e) {
    const targetElement =
      this.el.nativeElement.querySelector("#custom-carousel");
    const targetPosition = targetElement.getBoundingClientRect().top;
    const scrollPosition =
      targetPosition > 200 ? targetPosition - 120 : targetPosition;
    if (targetElement) {
      // targetElement.scrollIntoView({
      //   top: scrollPosition,
      //   behavior: "smooth",
      //   block: "start",
      // });
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    }
  }
}
