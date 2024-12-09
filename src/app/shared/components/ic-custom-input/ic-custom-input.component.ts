import { getCurrencySymbol } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-ic-custom-input",
  templateUrl: "./ic-custom-input.component.html",
  styleUrls: ["./ic-custom-input.component.scss"]
})
export class IcCustomInputComponent implements OnInit {
  @Input("control") control: AbstractControl | any;
  @Input("isdControl") isdControl: AbstractControl | any;
  @Input("inputLabel") inputLabel: string | any;
  @Input("matSuffix") matSuffix: string | any;
  @Input("customClass") customClass: string | any;
  @Input("hintText") hintText: string | any;
  @Input("readonly") readonly: boolean | any;
  @Input("isdCode") isdCode: any;
  @Input("country") country: any;
  currencySymbol: string | any;
  @Input("showInfoIcon") showInfoIcon: boolean | any;
  @Input("hide") hide: boolean | any;
  @Input("skipLabel") skipLabel: boolean = false;
  @Output()
  bankSearch = new EventEmitter<string>();
  @Output() onSuffixClick = new EventEmitter<any>();

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry
      .addSvgIcon(
        "search-icon",
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/svg/search-icon.svg"
        )
      )
      .addSvgIcon(
        "transfer",
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          "assets/images/svg/transfer.svg"
        )
      );
  }

  ngOnInit(): void {
    this.currencySymbol = getCurrencySymbol(this.country, "narrow");
  }
  search() {
    this.bankSearch.emit("OPEN");
    this.onSuffixClick.emit();
  }
}
