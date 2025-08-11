import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  ThemeChangeService,
  ThemeOption,
} from './shared/services/theme-change.service';
import { RoutingState } from './shared/helpers/routingState';
import { LoadingService, RoutePartsService } from '@onerumango/utils';
import { ThemeConfigService } from '@onerumango/icust-element-library';

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
    private themeChangeService: ThemeChangeService,
    private routingState: RoutingState,
    private _loaderService: LoadingService,
    private themeConfiguration: ThemeConfigService,
  ) {
    this.themeConfiguration.setTheme('ruby');
    this.listOfThemeColors = this.themeChangeService.themeColors;

    this.themeChangeService.setCurrentTheme(
      this.listOfThemeColors[0] as ThemeOption,
    );
    this.routingState.loadRouting();
    window.addEventListener('storage', this.handleStorageEvent);
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
