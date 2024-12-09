import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TabModel } from "app/shared/models/tab-model";
import { IconService } from "app/shared/services/icon.service";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-toolbar-tab",
  templateUrl: "./toolbar-tab.component.html",
  styleUrls: ["./toolbar-tab.component.scss"]
})
export class ToolbarTabComponent implements OnInit, OnChanges, AfterViewInit {
  @Input("items") items: TabModel[] = [];
  selectedTab!: string | any;
  @ViewChild("scrollContainer", { static: false }) scrollContainer:
    | ElementRef
    | any;
  isScrolled: boolean = false;
  selectedTabIndex: any;
  @Input("showArrow") showArrow: boolean = true;
  @Output()
  onTabSelect: EventEmitter<TabModel> = new EventEmitter<TabModel>();

  constructor(private iconService: IconService, private router: Router) {
    //This will add arrow back icon in mat icon registry
    this.iconService
      .addIconIfNotExists("arrow-back", "assets/images/arrow-back.svg")
      .subscribe((exists) => {
        if (exists) {
          console.log(`Icon arrow-back already exists.`);
        } else {
          console.log(`Icon arrow-back was added.`);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.items?.currentValue) this.addSvgIcon();
  }

  ngOnInit(): void {
    let route = this.router.url;
    this.selectCurrentRoute(route);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEndEvent = event as NavigationEnd; // Type assertion
        route = navEndEvent.urlAfterRedirects;
        this.selectCurrentRoute(route);
      });
  }

  ngAfterViewInit(): void {
    this.centerSelectedTab();
  }

  /**
   * Add svg icon to mat icon registry, if it is not present in mat icon registry
   */
  addSvgIcon() {
    this.items.forEach((item) => {
      this.iconService
        .addIconIfNotExists(item?.icon, item?.src)
        .subscribe((exists) => {
          if (exists) {
            console.log(`Icon ${item?.icon} already exists.`);
          } else {
            console.log(`Icon ${item?.icon} was added.`);
          }
        });

      this.iconService
        .addIconIfNotExists(item?.selectedIcon, item?.selectedSrc)
        .subscribe((exists) => {
          if (exists) {
            console.log(`Icon ${item?.selectedIcon} already exists.`);
          } else {
            console.log(`Icon ${item?.selectedIcon} was added.`);
          }
        });
    });
  }

  /**
   * On change route the particular tab will be selected
   * @param route
   */
  selectCurrentRoute(route: any) {
    const index: number = this.items.findIndex(
      (item: TabModel) => item?.route == route
    );
    if (index) {
      this.selectedTab = this.items[index]?.screenName;
      this.selectedTabIndex = index;
      this.onTabSelect.emit(this.items[index]);
    }
  }

  /**
   * on click on the buttong it will navigate to particular tab and will render that screen
   * @param route this is navigation path of the each tab
   */
  navigate(item: TabModel, index: number) {
    this.selectedTab = item.screenName;
    this.selectedTabIndex = index;
    this.centerSelectedTab();
    if (!item?.route) return;
    this.router.navigate([item?.route]);
  }

  /**
   * on scroll if we are scrolling to right the left arrow will be displayed to scroll left
   */
  onScroll() {
    const scrollLeft = this.scrollContainer.nativeElement.scrollLeft;
    this.isScrolled = scrollLeft > 0;
  }

  /**
   * Scroll towards left
   */
  scroolToLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -100,
      behaviour: "smooth"
    });
  }

  /**
   * Scroll towards right
   */
  scrollToRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 100,
      behaviour: "smooth"
    });
  }

  centerSelectedTab() {
    const tabsContainerEl = this.scrollContainer.nativeElement;
    const selectedTabEl = tabsContainerEl.children[this.selectedTabIndex];

    const containerWidth = tabsContainerEl?.offsetWidth;
    const tabWidth = selectedTabEl?.offsetWidth;

    const offset =
      selectedTabEl?.offsetLeft - containerWidth / 2 + tabWidth / 2;

    tabsContainerEl.scrollTo({
      left: offset,
      behavior: "smooth"
    });
  }
}
