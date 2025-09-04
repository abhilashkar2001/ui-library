import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
  Type,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ResolveStart,
  ResolveEnd,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
// import { ThemeService } from 'app/shared/services/theme.service';
// import { LayoutService } from 'app/shared/services/layout.service';
// import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';
// import { SidenavService } from 'app/shared/services/sidenav.service';
import { MatDrawer, MatSidenav } from '@angular/material/sidenav';
import { ThemeService } from 'app/shared/services/theme.service';
import { LayoutService } from 'app/shared/services/layout.service';
// import { ThemeService } from 'app/shared/services/theme/theme.service';
// import { LayoutService } from 'app/shared/services/layout/layout.service';
// import { SidenavService } from 'app/shared/services/sidenav/sidenav.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html',
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  public isModuleLoading = false;
  private moduleLoaderSub!: Subscription;
  private layoutConfSub!: Subscription;
  private routerEventSub: Subscription;

  @ViewChild('notifyPanel') rightSidenav!: MatSidenav;
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true })
  dynamicContent!: ViewContainerRef;

  @ViewChild('drawerContainer', { read: ViewContainerRef })
  vcr!: ViewContainerRef;
  @ViewChild('drawer') drawer!: MatDrawer;

  sidenavWidth = '50%';
  sidenavBgColor = '#F5F6FF';

  constructor(
    private router: Router,
    public translate: TranslateService,
    public themeService: ThemeService,
    private layout: LayoutService,
    // private jwtAuth: JwtAuthService,
    // private sidenavService: SidenavService,
    private cdr: ChangeDetectorRef,
  ) {
    // Check Auth Token is valid
    // this.jwtAuth.checkTokenIsValid().subscribe();

    // Close sidenav after route change in mobile
    this.routerEventSub = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange: any) => {
        this.layout.adjustLayout({ route: routeChange.url });
      });

    // Translator init
    const browserLang: string = translate.getBrowserLang() || '';
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }

  ngOnInit() {
    // FOR MODULE LOADER FLAG
    this.moduleLoaderSub = this.router.events.subscribe((event) => {
      if (
        event instanceof RouteConfigLoadStart ||
        event instanceof ResolveStart
      ) {
        this.isModuleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  // onResize(event: any) {
  //   this.layout.adjustLayout(event);
  //     this.sidenavPanel.openedStart.subscribe(() => {
  //     document.body.classList.add('no-scroll');
  //   });

  //   this.sidenavPanel.closedStart.subscribe(() => {
  //     document.body.classList.remove('no-scroll');
  //   });
  // }
  ngAfterViewInit() {}

  ngOnDestroy() {
    if (this.moduleLoaderSub) {
      this.moduleLoaderSub.unsubscribe();
    }
    if (this.layoutConfSub) {
      this.layoutConfSub.unsubscribe();
    }
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe();
    }
  }

  openSidenavComponent<T>(
    component: Type<T>,
    inputs?: any,
    disableClose = false,
    onCloseCallback?: (data: any) => void,
  ) {
    this.dynamicContent.clear();

    const componentRef: any = this.dynamicContent.createComponent(component);

    if (inputs) {
      if (inputs?.width) this.sidenavWidth = inputs.width;

      Object.assign(componentRef.instance, inputs);
    }
    if ((componentRef.instance as any).savedData) {
      (componentRef.instance as any).savedData.subscribe((data: any) => {
        if (onCloseCallback) onCloseCallback(data);
        this.closeSidenav();
      });
    }
    this.rightSidenav.disableClose = disableClose ?? false;
    this.rightSidenav.open();

    this.cdr.detectChanges();
  }

  closeSidenav() {
    this.rightSidenav.close();
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
