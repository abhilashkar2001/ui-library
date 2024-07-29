import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-credit-info",
  templateUrl: "./credit-info.component.html",
  styleUrls: ["./credit-info.component.scss"],
})
export class CreditInfoComponent implements OnInit {
  creditInfoForm: FormGroup;
  today = new Date();
  constructor(
    private fb: FormBuilder,
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

  ngOnInit(): void {
    this.buildCreditInfoForm({});
  }

  buildCreditInfoForm(data) {
    this.creditInfoForm = this.fb.group({
      requestDate: [data?.requestDate ?? ""],
      loanCurrency: [data?.loanCurrency ?? ""],
      loanAmount: [data?.loanAmount ?? ""],
      natureOfGoods: [data?.natureOfGoods ?? "capital"],
      tenure: [data?.tenure ?? ""],
      commodity: [data?.commodity ?? ""],
    });
  }
}
