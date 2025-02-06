export interface QuickLinkTabModel {
  screenName: string;
  childTab: Tabs;
}

export interface TabModel {
  screenName: string;
  route?: string;
  key?: string;
  src: string;
  selectedSrc: string;
  icon: string;
  selectedIcon: string;
  skipActionButton?: boolean;
  childTabs?: TabModel[];
  serviceTabs?: TabModel[];
}

export declare type Tabs = TabModel[];
