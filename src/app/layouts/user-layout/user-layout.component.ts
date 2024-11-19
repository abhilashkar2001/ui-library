import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  HostListener,
  ViewContainerRef,
  ChangeDetectorRef,
} from "@angular/core";
import {
  Router,
  NavigationEnd,
  RouteConfigLoadStart,
  RouteConfigLoadEnd,
  ResolveStart,
  ResolveEnd,
} from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { MatSidenav } from "@angular/material/sidenav";
import { LayoutService } from "app/shared/services/layout.service";
import { SidenavService } from "app/shared/services/sidenav.service";
import { ThemeService } from "app/shared/services/theme.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-user-layout",
  templateUrl: "./user-layout.component.html",
  styleUrls: ["./user-layout.component.scss"],
})
export class UserLayoutComponent implements OnInit, AfterViewInit {
  public isModuleLoading: Boolean = false;
  private moduleLoaderSub: Subscription;
  private layoutConfSub: Subscription;
  private routerEventSub: Subscription;

  @ViewChild("panel", { static: true }) private sidePanel: MatSidenav;
  @ViewChild("content", { static: true, read: ViewContainerRef })
  private vcf: ViewContainerRef;
  public customPanelClass: string = "panel-end-drawer";
  public layoutConf: any = {};
  public adminContainerClasses: any = {};
  public moduleContainerClass: any = {};
  module: string;

  constructor(
    private router: Router,
    public translate: TranslateService,
    public themeService: ThemeService,
    private layout: LayoutService,
    private sidenavService: SidenavService,
    private cdr: ChangeDetectorRef
  ) {
    // Close sidenav after route change in mobile
    this.routerEventSub = router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        let isRefresh = this.router.url.split("/").slice(1)[0];
        this.layout.adjustLayout({ route: routeChange.url });
      });

    // Translator init
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : "en");
  }

  ngOnInit() {
    this.layoutConfSub = this.layout.layoutConf$.subscribe((layoutConf) => {
      // this obj should be removed, it should be dynamic
      this.layoutConf = {
        breadcrumb: "simple",
        dir: "ltr",
        footerColor: "slate",
        footerFixed: false,
        isMobile: false,
        matTheme: "egret-navy",
        navigationPos: "top",
        perfectScrollbar: true,
        sidebarColor: "slate",
        sidebarCompactToggle: false,
        sidebarStyle: "full",
        topbarColor: "white",
        topbarFixed: true,
        useBreadcrumb: true,
      };

      this.adminContainerClasses = this.updateAdminContainerClasses(
        this.layoutConf
      );

      this.cdr.markForCheck();
    });
    this.sidenavService.setPanel(this.sidePanel);
    this.sidenavService.setContentVcf(this.vcf);
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

  updateAdminContainerClasses(layoutConf) {
    return {
      "sidebar-full": layoutConf.sidebarStyle === "full",
      "sidebar-opened":
        layoutConf.sidebarStyle !== "closed" &&
        layoutConf.navigationPos === "side",
      "sidebar-closed": layoutConf.sidebarStyle === "closed",
    };
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.layout.adjustLayout(event);
  }

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
}
