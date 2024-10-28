import { HeaderModel } from "app/shared/models/card.model";
import { QuickLinkTabModel, TabModel } from "app/shared/models/tab-model";

export class PrepaidCardStore {
  static readonly prepaidCardTab: TabModel[] = [
    {
      screenName: "Reload",
      route: "/user/card/prepaid-card/service/reload",
      src: "assets/images/svg/card-icons/pin-generation-blue.svg",
      selectedSrc: "assets/images/svg/card-icons/pin-generation-white.svg",
      icon: "pin-gen-icon",
      selectedIcon: "selected-pin-gen-icon",
    },
    {
      screenName: "PIN Generation",
      route: "/user/card/prepaid-card/service/pin-generation",
      src: "assets/images/svg/card-icons/change-pin-blue.svg",
      selectedSrc: "assets/images/svg/card-icons/change-pin-white.svg",
      icon: "change-pin-icon",
      selectedIcon: "selected-change-pin-icon",
    },
    {
      screenName: "Block Card",
      route: "/user/card/prepaid-card/service/block-card",
      src: "assets/images/svg/card-icons/block-card-blue.svg",
      selectedSrc: "assets/images/svg/card-icons/block-card-white.svg",
      icon: "block-card-icon",
      selectedIcon: "selected-block-card-icon",
    },
    {
      screenName: "Refund",
      route: "/user/card/prepaid-card/service/refund",
      src: "assets/images/svg/card-icons/pin-generation-blue.svg",
      selectedSrc: "assets/images/svg/card-icons/pin-generation-white.svg",
      icon: "pin-gen-icon",
      selectedIcon: "selected-pin-gen-icon",
    },
  ];
  static readonly manageCardTabs: TabModel[] = [
    {
      screenName: "Card Control",
      route: "/user/card/credit-card/manage-card/card-control",
      src: "assets/images/card-control-icon.svg",
      selectedSrc: "assets/images/selected-card-control-icon.svg",
      icon: "card-control-icon",
      selectedIcon: "selected-card-control-icon",
    },
    {
      screenName: "Usage Limit",
      route: "/user/card/credit-card/manage-card/card-usage",
      src: "assets/images/selected-usage-limit-icon.svg",
      selectedSrc: "assets/images/selected-usage-limit-icon.svg",
      icon: "selected-usage-limit-icon",
      selectedIcon: "selected-usage-limit-icon",
    },
  ];

  static readonly applyTabs: TabModel[] = [
    {
      screenName: "Apply Card",
      route: "/card/credit-card/manage/card-control",
      src: "assets/images/svg/card-icons/card-control-icon.svg",
      selectedSrc:
        "assets/images/svg/card-icons/selected-card-control-icon.svg",
      icon: "card-control-icon",
      selectedIcon: "selected-card-control-icon",
    },
    {
      screenName: "Tracking",
      route: "/card/credit-card/manage/card-usage",
      src: "assets/images/svg/card-icons/selected-usage-limit-icon.svg",
      selectedSrc: "assets/images/svg/card-icons/selected-usage-limit-icon.svg",
      icon: "usage-limit-icon",
      selectedIcon: "selected-usage-limit-icon",
    },
  ];

  static readonly recentTransTabs: string[] = ["Forex Transaction"];

  static readonly externalLinks = [
    "Invesments",
    "Credit Card",
    "Fixed Deposit",
    "Personal Banking",
    "Mobile Banking",
    "Corporate Banking",
    "Create Account",
    "Help & Support",
  ];
  static readonly Links = [
    "Reload",
    "PIN Generation",
    "Block Card",
    "Refund"
  ];
  static readonly ManageLinks = ["Card Control", "Usage Limit"];

static readonly prepaidQuickLinks: QuickLinkTabModel[] = [
    {
      screenName: "Service",
      childTab: this.prepaidCardTab,
    },
    {
      screenName: "Apply",
      childTab: this.applyTabs,
    },
  ];

  
  static readonly prepaidDetailsItem: HeaderModel[] = [
    {
      key: "customerName",
      label: "Card Holder",
    },
    {
      key: "typeOfCard",
      label: "Card Type",
    },
    {
      key: "lastPaymentDate",
      label: "Registration Date",
    },
  ];
}