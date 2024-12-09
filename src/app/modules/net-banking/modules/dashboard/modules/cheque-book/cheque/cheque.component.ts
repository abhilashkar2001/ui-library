import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ChequeStore } from "../cheque.store";

@Component({
  selector: "app-cheque",
  templateUrl: "./cheque.component.html",
  styleUrls: ["./cheque.component.scss"]
})
export class ChequeComponent implements OnInit {
  items = ChequeStore.tabScreens.filter((item) =>
    item?.screenName?.toLowerCase()?.includes("cheque")
  );
  tabScreens = this.items;
  selected: string = this.tabScreens[0]?.screenName;
  constructor(
    private route: Router,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {
    const navigation: any = this.route.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.selected = navigation?.extras?.state?.screenName;
    }
    this.tabScreens.forEach((tab) => {
      this.matIconRegistry.addSvgIcon(
        tab.icon,
        this.sanitizer.bypassSecurityTrustResourceUrl(tab.src)
      );
      this.matIconRegistry.addSvgIcon(
        tab.selectedIcon,
        this.sanitizer.bypassSecurityTrustResourceUrl(tab.selectedSrc)
      );
    });
  }

  ngOnInit(): void {}

  changeTabs(index: any) {
    console.log(index);
    this.selected = this.tabScreens[index].screenName;
    console.log(this.selected);
    this.route.navigate([this.tabScreens[index].route]);
  }
}
