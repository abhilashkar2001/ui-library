import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { FooterConstant } from "./footer.constant";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  socialMedia = FooterConstant.SOCIAL_MEDIA;
  footerPages = FooterConstant.FOOTER_PAGES;
  helpSection = FooterConstant.FOOTER_HELP_SECTION;
  hideNavItem: boolean = false;
  userDetails: any;
  @Output() scrollToTop = new EventEmitter<any>();
  constructor(
    private showSideBar: NewDepositService,
    private store: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.userDetails = this.store.getUser();
    this.showSideBar.getToken().subscribe((resp) => {
      this.hideNavItem = resp;
    });
  }
  opened(path) {
    if (path) window.location.href = path;
    else this.scrollToTop.emit({ scroll: true });
  }
}
