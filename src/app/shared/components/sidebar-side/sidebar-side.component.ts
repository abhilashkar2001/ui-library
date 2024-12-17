import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../shared/services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';
import { ILayoutConf, LayoutService } from 'app/shared/services/layout.service';
import { JwtAuthService } from 'app/shared/services/auth/jwt-auth.service';

@Component({
  selector: 'app-sidebar-side',
  templateUrl: './sidebar-side.component.html',
})
export class SidebarSideComponent implements OnInit, OnDestroy {
  public menuItems: any[] | any;
  public hasIconTypeMenuItem: boolean | any;
  public iconTypeMenuTitle: string | any;
  private menuItemsSub: Subscription | any;
  public layoutConf: ILayoutConf | any;

  constructor(
    private navService: NavigationService,
    public themeService: ThemeService,
    private layout: LayoutService,
    public jwtAuth: JwtAuthService,
  ) {}

  ngOnInit() {
    this.iconTypeMenuTitle = this.navService.iconTypeMenuTitle;
    this.menuItemsSub = this.navService.menuItems$.subscribe((menuItem) => {
      this.menuItems = menuItem;
      //Checks item list has any icon type.
      this.hasIconTypeMenuItem = !!this.menuItems.filter(
        (item: any) => item.type === 'icon',
      ).length;
    });
    this.layoutConf = this.layout.layoutConf;
  }

  ngOnDestroy() {
    if (this.menuItemsSub) {
      this.menuItemsSub.unsubscribe();
    }
  }
  toggleCollapse() {
    if (this.layoutConf.sidebarCompactToggle) {
      this.layout.publishLayoutChange({
        sidebarCompactToggle: false,
      });
    } else {
      this.layout.publishLayoutChange({
        // sidebarStyle: "compact",
        sidebarCompactToggle: true,
      });
    }
  }
}
