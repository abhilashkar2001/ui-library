import { Component, OnInit, AfterViewInit } from "@angular/core";
import { UserActiveState } from "app/shared/helpers/userActiveState";
import { ThemeService } from "app/shared/services/theme.service";
@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.template.html"
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  constructor(
    public themeService: ThemeService,
    private userActiveState: UserActiveState
  ) {
    this.userActiveState.getUserActivity();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
