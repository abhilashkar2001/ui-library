import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface IMenuItem {
  type: 'link' | 'dropDown' | 'icon' | 'separator' | 'extLink';
  name?: string;
  state?: string;
  icon?: string;
  svgIcon?: string;
  tooltip?: string;
  disabled?: boolean;
  sub?: IChildItem[];
  badges?: IBadge[];
}

interface IChildItem {
  type?: string;
  name: string;
  state?: string;
  icon?: string;
  svgIcon?: string;
  sub?: IChildItem[];
}

interface IBadge {
  color: string;
  value: string;
}

@Injectable()
export class NavigationService {
  defaultMenu: IMenuItem[] = [
    {
      name: 'Blank page',
      type: 'link',
      icon: 'dashboard',
      state: 'admin/dashboard',
    },
    {
      name: 'DOC',
      type: 'extLink',
      tooltip: 'Documentation',
      icon: 'library_books',
      state: '',
    },
  ];

  // Icon menu TITLE at the very top of navigation.
  // This title will appear if any icon type item is present in menu.
  iconTypeMenuTitle = 'Frequently Accessed';
  // sets iconMenu as default;
  menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
  // navigation component has subscribed to this Observable
  menuItems$ = this.menuItems.asObservable();
}
