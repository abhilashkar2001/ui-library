import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ThemeService } from "../../../shared/services/theme.service";
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from "../../services/layout.service";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-user-header-top",
  templateUrl: "./user-header-top.component.html",
  styleUrls: ["./user-header-top.component.scss"],
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

  constructor(
    private layout: LayoutService,
    public themeService: ThemeService,
    public translate: TranslateService,
    public tokenStorageService: TokenStorageService,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
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

  ngOnDestroy() {}
}
