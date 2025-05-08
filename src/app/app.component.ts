import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UILibIconService } from './shared/services/ui-lib-icon.service';
import {
  ThemeChangeService,
  ThemeOption,
} from './shared/services/theme-change.service';
import { RoutingState } from './shared/helpers/routingState';
import { LoadingService, RoutePartsService } from '@onerumango/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  appTitle = 'iCust';
  pageTitle = '';
  listOfThemeColors: Partial<ThemeOption>[];
  show = false;

  constructor(
    public title: Title,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private iconService: UILibIconService,
    private themeChangeService: ThemeChangeService,
    private routingState: RoutingState,
    private _loaderService: LoadingService,
  ) {
    this.listOfThemeColors = this.themeChangeService.themeColors;

    this.themeChangeService.setCurrentTheme(
      this.listOfThemeColors[0] as ThemeOption,
    );
    this.routingState.loadRouting();
    window.addEventListener('storage', this.handleStorageEvent);
    this.iconService.init();
  }

  handleStorageEvent(event: StorageEvent) {
    if (event.key == 'isRemember') location.reload();
  }

  ngOnInit() {
    this.changePageTitle();

    this._loaderService.show$.subscribe((res) => {
      this.show = res;
    });
  }

  changePageTitle() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const routeParts = this.routePartsService.generateRouteParts(
          this.activeRoute.snapshot,
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
