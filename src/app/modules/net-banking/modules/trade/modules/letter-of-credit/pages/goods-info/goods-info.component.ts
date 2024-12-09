import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-goods-info",
  templateUrl: "./goods-info.component.html",
  styleUrls: ["./goods-info.component.scss"]
})
export class GoodsInfoComponent implements OnInit {
  @Input("updateParentModel") updateParentModel:
    | ((part: Partial<any>, isFormValid: boolean) => void)
    | any;
  goodsInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    console.log("goods-info");
    this.buildGoodsInfo();
  }

  buildGoodsInfo() {
    this.goodsInfoForm = this.fb.group({
      partialShipmentOption: [""],
      transshipmentOption: [""],
      placeOfReciept: [""],
      placeOfFinalDestination: [""],
      prtOfLoadingOrArptOfDestination: [""],
      prtOfDschrgOrArptOfDestination: [""],
      lstDateOfShipment: [""],
      descOfGoodsOrServices: [""],
      expiryDate: [""],
      proformaDate: [""],
      proformaInvcNo: [""],
      insuranceCoverageDetails: [""],
      policyNumber: [""],
      policyDate: [""],
      merchantTradeLc: [""],
      tradeTerms: [""],
      place: [""],
      hsCode: [""],
      docToBeWithIn: [""],
      dayFromDateOf: [""],
      // countryOfOrigin: [""],
      countryId: [""]
    });

    this.goodsInfoForm.valueChanges.subscribe((res) => {
      this.updateParentModel(
        {
          goodsInfo: {
            ...res
          }
        },
        this.checkForm()
      );
    });
  }

  checkForm() {
    return this.goodsInfoForm.valid;
  }
}
