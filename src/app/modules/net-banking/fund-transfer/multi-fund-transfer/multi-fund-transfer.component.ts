import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GenericValueService } from "app/shared/services/generic-value.service";

@Component({
  selector: "app-multi-fund-transfer",
  templateUrl: "./multi-fund-transfer.component.html",
  styleUrls: ["./multi-fund-transfer.component.scss"],
})
export class MultiFundTransferComponent implements OnInit {
  multiTransferForm: FormGroup;
  genericValue = { TRANSFERMODE: [] };

  constructor(
    private fb: FormBuilder,
    private genericValueService: GenericValueService
  ) {}

  ngOnInit(): void {
    this.initMultiTransferForm();
    this.fetchGenericValues();
  }

  initMultiTransferForm() {
    this.multiTransferForm = this.fb.group({
      transferFrom: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      transferMode: ["", [Validators.required]],
      transferTo: ["", [Validators.required]],
      transferOn: ["", [Validators.required]],
      sendAdvice: [""],
      narration: [""],
      paymentDetails: [""],
      remarks: [""],
    });
  }

  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
  }
}
