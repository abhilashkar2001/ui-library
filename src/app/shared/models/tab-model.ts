export interface TabSteps {
  id: number;
  title: string;
}

export interface QuickLinkTabModel {
  screenName: string;
  childTab: Tabs;
}

export declare type QuickLinkTabs = QuickLinkTabModel[];

export interface TabModel {
  screenName: string;
  route?: string;
  src: string;
  selectedSrc: string;
  icon: string;
  selectedIcon: string;
  skipActionButton?: boolean;
  childTabs?: TabModel[];
  serviceTabs?: TabModel[];
}

export declare type Tabs = TabModel[];
