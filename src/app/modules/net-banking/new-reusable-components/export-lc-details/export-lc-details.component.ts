import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-export-lc-details",
  templateUrl: "./export-lc-details.component.html",
  styleUrls: ["./export-lc-details.component.scss"],
})
export class ExportLcDetailsComponent implements OnInit {
  radioArr: any[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  lcOrder: FormGroup;
  doneData: boolean[] = [];
  showHeader: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.bulidForm();
    this.addLcDetails();
  }

  bulidForm() {
    this.lcOrder = this.fb.group({
      shipment: [""],
      lcCheck: [false],
      fobvalue: [""],
      policyNo: [""],
      policyDate: [""],
      subvention: ["yes"],
      remarks: [""],
      enduse: [""],
      lcDetails: this.fb.array([]),
    });
  }

  get lcDetailss(): FormArray {
    return this.lcOrder.get("lcDetails") as FormArray;
  }

  lcDetailsForm() {
    return this.fb.group({
      buyerName: [""],
      buyerCountry: [""],
      lcOrderNo: [""],
      lcOrderDate: [""],
      lastShipment: [""],
      lcCurrency: [""],
      lcAmount: [""],
      exportCountry: [""],
      commodity: [""],
      incoTerm: [""],
      hsnCode: [""],
    });
  }

  addLcDetails() {
    this.lcDetailss.push(this.lcDetailsForm());
    const lclength = this.lcDetailss.length - 1;
    this.doneData[lclength] = false;
  }

  doneClick(inde) {
    this.doneData[inde] = true;
    this.showHeader = true;
  }

  removelcOrder(lcindex) {
    this.doneData[lcindex] = false;
    this.lcDetailss.removeAt(lcindex);
    if (this.lcDetailss.length == 0) {
      this.showHeader = false;
    }
  }

  editClick(editInd) {
    this.doneData[editInd] = false;
  }
}
