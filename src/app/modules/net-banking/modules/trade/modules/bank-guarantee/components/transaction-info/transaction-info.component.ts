import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-transaction-info",
  templateUrl: "./transaction-info.component.html",
  styleUrls: ["./transaction-info.component.scss"]
})
export class TransactionInfoComponent implements OnInit {
  @Input() transactionInfoForm!: FormGroup;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/calendar.svg"
      )
    );
  }

  ngOnInit(): void {}
}
