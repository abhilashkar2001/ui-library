import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { ThemeService } from "../../../shared/services/theme.service";
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from "../../services/layout.service";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TokenStorageService } from "app/shared/token-storage.service";
import {
  ThemeChangeService,
  ThemeOption
} from "app/shared/services/theme-change.service";

@Component({
  selector: "app-user-header-top",
  templateUrl: "./user-header-top.component.html",
  styleUrls: ["./user-header-top.component.scss"]
})
export class UserHeaderTopComponent implements OnInit, OnDestroy {
  layoutConf: any;

  @Input() notificPanel;
  @Input() mainMenuPanel;
  // header properties start
  currentUser: any;
  roleName: any;
  fileUrl: any;
  basePath = environment.microServiceURL;
  userImage = "/assets/images/profile-user.png";
  lastLoginTime: any;

  // Theme change variables
  listOfThemeColors: ThemeOption[] = [];
  selectedTheme: ThemeOption;

  languageList = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" }
  ];
  selectedLanguage: { code: string; name: string };
  constructor(
    private layout: LayoutService,
    public themeService: ThemeService,
    public translate: TranslateService,
    public tokenStorageService: TokenStorageService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private themeChangeService: ThemeChangeService
  ) {
    this.listOfThemeColors = this.themeChangeService.themeColors;
    themeChangeService.getCurrentTheme$.subscribe(
      (theme) => (this.selectedTheme = theme)
    );

    this.matIconRegistry.addSvgIcon(
      `custom-menu-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/custom-menu.svg"
      )
    );
  }

  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;
    this.currentUser = this.tokenStorageService.getUser();
    this.roleName = this.currentUser?.roles?.[0]?.roleName;
    this.lastLoginTime = this.tokenStorageService.getLastLoginSession();
    setTimeout(() => {
      let lang = this.tokenStorageService.getLanguage() ?? "en";
      this.translate.use(lang);
    }, 300);
  }

  handleThemeChange(theme: string) {
    this.themeChangeService.setCurrentTheme(theme);
  }

  getFileUrl(filePath: string) {
    const file = this.basePath + filePath;
    let parseFileUrl;
    if (file) {
      parseFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file);
    } else {
      parseFileUrl = this.userImage;
    }
    console.log(parseFileUrl);

    this.fileUrl = parseFileUrl;
    this.cdr.markForCheck();
  }

  setLang(lng) {
    this.translate.use(lng.code);
  }

  toggleNotific() {
    this.notificPanel.toggle();
  }

  toggleMenu() {
    this.mainMenuPanel.toggle();
  }

  signOut() {
    this.tokenStorageService.signOut();
    this.router.navigate(["sessions/signin"]);
  }
  switchLanguage(language: string) {
    console.log("324567890");

    console.log(language);
    this.selectedLanguage = this.languageList.find(
      (lang) => lang.code === language
    );
    this.tokenStorageService.saveLanguage(language);
    let lang = this.tokenStorageService.getLanguage();
    this.translate.use(lang);
  }
  ngOnDestroy() {}
}
