import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TokenStorageService } from '@onerumango/utils';
import {
  ThemeChangeService,
  ThemeOption,
} from 'app/shared/services/theme-change.service';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { LangTeme } from 'app/shared/models/current-lang-theme.model';
import { Store } from '@ngrx/store';
import { selectUser } from '@onerumango/utils';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';

@Component({
  selector: 'app-user-header-top',
  templateUrl: './user-header-top.component.html',
  styleUrls: ['./user-header-top.component.scss'],
})
export class UserHeaderTopComponent implements OnInit, OnDestroy {
  layoutConf: any;

  @Input() notificPanel: any;
  @Input() mainMenuPanel: any;
  // header properties start
  currentUser: any;
  roleName: string | undefined;
  fileUrl!: File | SafeResourceUrl;
  basePath = environment.microServiceURL;
  userImage = '/assets/images/profile-user.png';
  lastLoginTime: Date | undefined;

  // Theme change variables
  listOfThemeColors: ThemeOption[] | Partial<ThemeOption>[] = [];
  selectedTheme!: ThemeOption | null;
  languageList = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
  ];
  selectedLanguage: { code: string; name: string } | undefined;
  currentLangTheme: LangTeme | undefined;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
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
    private themeChangeService: ThemeChangeService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.listOfThemeColors = this.themeChangeService.themeColors;
    themeChangeService.getCurrentTheme$.subscribe(
      (theme) => (this.selectedTheme = theme),
    );

    this.matIconRegistry.addSvgIcon(
      `custom-menu-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/custom-menu.svg',
      ),
    );
  }

  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;
    this.loadUserProfile();

    this.lastLoginTime = this.tokenStorageService.getLastLoginSession();
    setTimeout(() => {
      const lang = this.tokenStorageService.getLanguage() ?? 'en';
      this.translate.use(lang);
    }, 300);
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
        if (this.currentUser)
          this.roleName = this.currentUser?.roles?.[0]?.roleName;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  handleThemeChange(theme: any) {
    this.themeChangeService
      .saveCurrentTheme({
        userId: this.currentUser.userId,
        language: this.tokenStorageService.getLanguage(),
        color: theme.theme as unknown as any,
        id: this.currentLangTheme?.id,
      })
      .subscribe();

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

    this.fileUrl = parseFileUrl;
    this.cdr.markForCheck();
  }

  toggleMenu() {
    this.mainMenuPanel.toggle();
  }

  signOut() {
    this.tokenStorageService.signOut();
    this.router.navigate(['sessions/signin']);
  }
  switchLanguage(language: string) {
    this.selectedLanguage = this.languageList.find(
      (lang) => lang.code === language,
    );
    this.tokenStorageService.saveLanguage(language);
    const lang = this.tokenStorageService.getLanguage();
    this.translate.use(lang);
    this.themeChangeService
      .saveCurrentTheme({
        userId: this.currentUser.userId,
        language: lang,
        color: this.selectedTheme?.theme,
        id: this.currentLangTheme?.id,
      })
      .subscribe();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
