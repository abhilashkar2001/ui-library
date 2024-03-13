import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { UserActiveState } from "app/shared/helpers/userActiveState";
import { ThemeService } from "app/shared/services/theme.service";
@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.template.html",
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    public translate: TranslateService,
    public themeService: ThemeService,
    private userActiveState: UserActiveState
  ) {
    this.userActiveState.getUserActivity();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  ngOnDestroy() {}

  scrollToTop(e) {
    window.scrollTo(0, 0);
  }
}
