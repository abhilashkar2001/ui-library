import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { RoutePartsService } from "./shared/services/route-parts.service";
import { filter } from "rxjs/operators";
import { UILibIconService } from "./shared/services/ui-lib-icon.service";
import {
  ThemeChangeService,
  ThemeOption
} from "./shared/services/theme-change.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = "iCust";
  pageTitle = "";
  listOfThemeColors: ThemeOption[] = [];

  constructor(
    public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private iconService: UILibIconService,
    private themeChangeService: ThemeChangeService
  ) {
    this.listOfThemeColors = this.themeChangeService.themeColors;

    this.themeChangeService.setCurrentTheme(this.listOfThemeColors[0]);

    this.iconService.init();
  }

  ngOnInit() {
    this.changePageTitle();
  }

  ngAfterViewInit() {}

  changePageTitle() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const routeParts = this.routePartsService.generateRouteParts(
          this.activeRoute.snapshot
        );
        if (!routeParts.length) {
          return this.title.setTitle(this.appTitle);
        }
        // Extract title from parts;
        this.pageTitle = routeParts
          .reverse()
          .map((part) => part.title)
          .reduce((partA, partI) => {
            return `${partA} > ${partI}`;
          });
        this.pageTitle += ` | ${this.appTitle}`;
        this.title.setTitle(this.pageTitle);
      });
  }
}
