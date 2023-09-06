import { Component, OnInit, Input, OnDestroy, Renderer2 } from "@angular/core";
import { NavigationService } from "../../../shared/services/navigation.service";
import { Subscription } from "rxjs";
import { ThemeService } from "../../../shared/services/theme.service";
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from "../../services/layout.service";
import { JwtAuthService } from "app/shared/services/auth/jwt-auth.service";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";

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

  constructor(
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private renderer: Renderer2,
    public jwtAuth: JwtAuthService,
    private showSideBar: NewDepositService
  ) {}

  ngOnInit() {
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
  ngOnDestroy() {
    this.menuItemSub.unsubscribe();
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
}
