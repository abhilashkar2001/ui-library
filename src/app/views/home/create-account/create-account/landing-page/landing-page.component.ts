import { Component, OnInit } from "@angular/core";
import { HomeService } from "app/shared/services/home-service/home.service";
@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.scss"],
})
export class LandingPageComponent implements OnInit {
  data: [] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getAccountTypes();
  }

  getAccountTypes() {
    this.homeService.getAccountTypes().subscribe((response: any) => {
      this.data = response.data;
    });
  }
}
