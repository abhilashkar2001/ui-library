import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Renderer2,
  ElementRef,
  SimpleChanges,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription } from "rxjs";
import { ThemeService } from "../../../shared/services/theme.service";
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from "../../services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationStart,
  Router,
} from "@angular/router";

@Component({
  selector: "app-header-top",
  templateUrl: "./header-top.component.html",
  styleUrls: ["./header-top.component.scss"],
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  layoutConf: any;
  menuItems: any;
  menuItemSub: Subscription;
  egretThemes: any[] = [];
  hideNavItem: boolean = false;
  showMobilemenu: boolean = false;

  public availableLangs = [
    {
      name: "EN",
      code: "en",
      flag: "us",
    },
    {
      name: "ES",
      code: "es",
      flag: "es",
    },
  ];
  currentLang = this.availableLangs[0];

  @Input() notificPanel;
  @Input() mainMenuPanel;
  headerType: any;

  items = [
    {
      label: "Open Account",
      route: "/account",
    },
    {
      label: "Card",
      route: "/card",
    },
    {
      label: "Deposits",
      route: "/deposits",
    },
    {
      label: "Loan",
      route: "/loan",
    },
  ];
  @ViewChildren("element") elReference: QueryList<ElementRef>;
  expand: number = 0;

  constructor(
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    public jwtAuth: JwtAuthService,
    private showSideBar: NewDepositService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.onNavigation(this.router.url);
    }, 100);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.onNavigation(event.url);
      }
    });
    this.layoutConf = this.layout.layoutConf;
    this.egretThemes = this.themeService.egretThemes;
    this.menuItemSub = this.navService.menuItems$.subscribe((res) => {
      res = res.filter(
        (item) => item.type !== "icon" && item.type !== "separator"
      );
      let limit = 4;
      let mainItems: any[] = res.slice(0, limit);
      if (res.length <= limit) {
        return (this.menuItems = mainItems);
      }
      let subItems: any[] = res.slice(limit, res.length - 1);
      mainItems.push({
        name: "More",
        type: "dropDown",
        tooltip: "More",
        icon: "more_horiz",
        sub: subItems,
      });
      this.menuItems = mainItems;
    });

    this.showSideBar.getToken().subscribe((resp) => {
      this.hideNavItem = resp;
    });
  }

  onNavigation(route) {
    const item = this.items.findIndex((i) => route.includes(i?.route));
    this.animateUnderline(
      this.elReference.find((element, index) => index === item)?.nativeElement
    );
  }

  ngOnDestroy() {
    this.menuItemSub.unsubscribe();
  }

  toggleMobileNavMenu() {
    this.showMobilemenu = !this.showMobilemenu;
  }

  // animate the nav link underline
  animateUnderline(elem: any) {
    if (elem) {
      const underlineElem = this.el.nativeElement.querySelector("#underline");
      const { left, width } = elem.getBoundingClientRect();
      this.renderer.setStyle(underlineElem, "left", left + "px");
      this.renderer.setStyle(underlineElem, "width", width + "px");
      this.showMobilemenu = false;
      window.scrollTo(0, 0);
    }
  }

  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  changeTheme(theme) {
    this.layout.publishLayoutChange({ matTheme: theme.name });
  }

  toggleNotific() {
    this.notificPanel.toggle();
  }

  toggleMenu() {
    this.mainMenuPanel.toggle();
  }

  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === "closed") {
      return this.layout.publishLayoutChange({
        sidebarStyle: "full",
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: "closed",
    });
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === "compact") {
      return this.layout.publishLayoutChange(
        {
          sidebarStyle: "full",
          sidebarCompactToggle: false,
        },
        { transitionClass: true }
      );
    }

    // * --> compact
    this.layout.publishLayoutChange(
      {
        sidebarStyle: "compact",
        sidebarCompactToggle: true,
      },
      { transitionClass: true }
    );
  }

  onSearch(e) {
    //   console.log(e)
  }

  openDropdown(i: number) {
    if (this.expand == i) {
      this.expand = 0;
      return;
    }
    this.expand = i;
  }

  redirectToSignIn() {
    this.router.navigate([`/sessions/signin`]);
  }
}
