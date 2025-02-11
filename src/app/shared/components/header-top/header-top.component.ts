import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  Renderer2,
  ElementRef,
  QueryList,
  ViewChildren,
  HostListener,
} from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { NewDepositService } from 'app/modules/origination/modules/new-deposit/new-deposit.service';
import { NavigationEnd, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MatIconRegistry } from '@angular/material/icon';
import { TokenStorageService } from '@onerumango/utils';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss'],
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  externalInternetRoutePort = ':4211';

  layoutConf: any;
  menuItems: any;
  menuItemSub: Subscription | any;
  egretThemes: any[] = [];
  hideNavItem = false;
  showMobilemenu = false;

  @Input() notificPanel: any;
  @Input() mainMenuPanel: any;
  items = [
    {
      label: 'Open Account',
      route: '/origination/account',
    },
    {
      label: 'Card',
      route: '/origination/card',
    },
    {
      label: 'Deposits',
      route: '/origination/deposits',
    },
    {
      label: 'Loan',
      route: '/origination/loan',
    },
  ];
  @ViewChildren('element') elReference: QueryList<ElementRef> | any;
  expand = 0;

  constructor(
    private layout: LayoutService,
    private navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    private showSideBar: NewDepositService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
  ) {
    this.matIconRegistry.addSvgIcon(
      `menu-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/menu_web.svg',
      ),
    );
  }

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
        (item) => item.type !== 'icon' && item.type !== 'separator',
      );
      const limit = 4;
      const mainItems: any[] = res.slice(0, limit);
      if (res.length <= limit) {
        return (this.menuItems = mainItems);
      }
      const subItems: any[] = res.slice(limit, res.length - 1);
      mainItems.push({
        name: 'More',
        type: 'dropDown',
        tooltip: 'More',
        icon: 'more_horiz',
        sub: subItems,
      });
      this.menuItems = mainItems;
      return;
    });

    this.showSideBar.getToken().subscribe((resp) => {
      this.hideNavItem = resp;
    });
  }

  onNavigation(route: any) {
    const item = this.items.findIndex((i) => route.includes(i?.route));
    this.animateUnderline(
      this.elReference.find((index: any) => index === item)?.nativeElement,
    );
  }

  ngOnDestroy() {
    this.menuItemSub.unsubscribe();
  }

  toggleMobileNavMenu() {
    this.showMobilemenu = !this.showMobilemenu;
  }

  @HostListener('document:click', ['$event'])
  clickOutsideDropdown(event: Event) {
    const target = event.target as HTMLElement;
    if (!this.isDescendant(target, document.querySelector('nav'))) {
      this.showMobilemenu = false;
    }
  }

  private isDescendant(child: HTMLElement, parent: HTMLElement | any): boolean {
    let node = child.parentNode;
    while (node != null) {
      if (node === parent) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  // animate the nav link underline
  animateUnderline(elem: any) {
    if (elem) {
      const underlineElem = this.el.nativeElement.querySelector('#underline');
      const { left, width } = elem.getBoundingClientRect();
      this.renderer.setStyle(underlineElem, 'left', left + 'px');
      this.renderer.setStyle(underlineElem, 'width', width + 'px');
      this.showMobilemenu = false;
      window.scrollTo(0, 0);
    }
  }

  onNavTabClick() {
    this.tokenStorageService.clearSessionExceptLoginInfo();
  }

  goToHomePage() {
    this.router.navigate(['/origination/account/landing']);
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

  trackingStatus() {
    this.router.navigate([`/origination/tracking`]);
  }

  /**
   * redirection to internet banking.
   */
  redirectToInternet() {
    const url = window.location.href;
    const baseUrl: any = url.split('#')[0]?.split('?')[0];
    const newBaseUrl = baseUrl.replace(
      /:(\d+)/,
      this.externalInternetRoutePort,
    );
    window.open(`${newBaseUrl}`, '_blank');
  }
}
