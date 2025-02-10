import { Injectable } from '@angular/core';
import { LayoutService } from './layout.service';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class CustomizerService {
  colors = [
    {
      class: 'black',
      active: false,
    },
    {
      class: 'white',
      active: false,
    },
    {
      class: 'dark-blue',
      active: false,
    },
    {
      class: 'grey',
      active: false,
    },
    {
      class: 'brown',
      active: false,
    },
    {
      class: 'gray',
      active: false,
    },
    {
      class: 'purple',
      active: false,
    },
    {
      class: 'blue',
      active: false,
    },

    {
      class: 'indigo',
      active: false,
    },
    {
      class: 'yellow',
      active: false,
    },
    {
      class: 'green',
      active: false,
    },
    {
      class: 'pink',
      active: false,
    },
    {
      class: 'red',
      active: false,
    },
    {
      class: 'slate',
      active: false,
    },
  ];
  topbarColors: any[];
  sidebarColors: any[];
  footerColors: any[];

  constructor(
    private layout: LayoutService,
    private sessionStorageService: SessionStorageService,
  ) {
    this.topbarColors = this.getTopbarColors();
    this.sidebarColors = this.getSidebarColors();
    this.footerColors = this.getFooterColors();
  }

  getSidebarColors() {
    const sidebarColors = [
      'black',
      'slate',
      'white',
      'grey',
      'brown',
      'purple',
      'dark-blue',
    ];
    return this.colors
      .filter((color) => {
        return sidebarColors.includes(color.class);
      })
      .map((c) => {
        c.active = c.class === this.layout.layoutConf.sidebarColor;
        return { ...c };
      });
  }

  getTopbarColors() {
    const topbarColors = [
      'black',
      'slate',
      'white',
      'dark-gray',
      'purple',
      'dark-blue',
      'indigo',
      'pink',
      'red',
      'yellow',
      'green',
    ];
    return this.colors
      .filter((color) => {
        return topbarColors.includes(color.class);
      })
      .map((c) => {
        c.active = c.class === this.layout.layoutConf.topbarColor;
        return { ...c };
      });
  }

  getFooterColors() {
    const footerColors = [
      'black',
      'slate',
      'white',
      'dark-gray',
      'purple',
      'dark-blue',
      'indigo',
      'pink',
      'red',
      'yellow',
      'green',
    ];
    return this.colors
      .filter((color) => {
        return footerColors.includes(color.class);
      })
      .map((c) => {
        c.active = c.class === this.layout.layoutConf.footerColor;
        return { ...c };
      });
  }

  getLogedCountry() {
    const userInfo = this.sessionStorageService.getUserInfo();
    if (userInfo) {
      return JSON.parse(userInfo);
    } else {
      return null;
    }
  }
}
