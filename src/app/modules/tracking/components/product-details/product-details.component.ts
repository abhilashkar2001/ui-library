import { Component, OnInit } from "@angular/core";
import { TrackingService } from "../../tracking-service";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { ProductConstant } from "./product.store";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"],
})
export class ProductDetailsComponent implements OnInit {
  dynamicDetails: any = [];
  mobileNumber: string;
  productType: string = "";

  constructor(private api: TrackingService, private route: ActivatedRoute) {}

  statusItems = [
    { title: "Application Submitted", value: 100 },
    { title: "Verification", value: 20 },
    { title: "Application Status", value: 0 },
  ];
  dynamicKeyHelper = {};

  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    this.route.queryParamMap.subscribe((params: any) => {
      this.productType = params.get("type");
    });
    this.mobileNumber = sessionStorage.getItem("trackingMobile");
    this.getOriginationById(id);
  }

  getOriginationById(id) {
    this.getWebSummary(id);
  }

  getWebSummary(id) {
    const observables = {
      originationDetails: this.api.getOriginationMaster(id),
      webSummary: this.productType.toLowerCase().includes("loan")
        ? this.api.getLoanSummary(id)
        : null,
    };

    forkJoin(observables).subscribe((resp: any) => {
      const originationDetails = resp.originationDetails;
      if (originationDetails?.statusCode === 200) {
        const orginationInfo = originationDetails.data[0];
        const kycDoc = orginationInfo.customerInfo
          .filter((obj) => obj.primaryCustomer)
          .flatMap((obj) =>
            obj.documnentsInfo.documents.flatMap((objDoc) => objDoc.docs)
          );

        if (resp.webSummary?.statusCode === 200) {
          const loanInfo = resp.webSummary.data;
          const loanTenure = `${loanInfo.loanDetails.loanTenureYear} Year ${loanInfo.loanDetails.loanTenureMonth} Months ${loanInfo.loanDetails.loanTenureDay} Day`;

          this.dynamicDetails = [
            {
              key: "loanAccountInfo",
              values: { ...loanInfo.loanDetails, tenure: loanTenure },
            },
            { key: "bankAccount", values: loanInfo.bankAccount ?? {} },
            {
              key: "disbursementDetails",
              values: loanInfo.disbursementDetails ?? {},
            },
            { key: "customerInfo", values: orginationInfo.customerInfo ?? {} },
            {
              key: "documnentsInfo",
              values: loanInfo.documnentsInfo.docInfoModel ?? [],
            },
            { key: "docs", values: kycDoc },
          ];
          this.dynamicKeyHelper = this.productType
            .toLowerCase()
            .includes("loan")
            ? ProductConstant.LoanDynamicKeys
            : ProductConstant.AccountDynamicKeys;
        } else {
          this.dynamicDetails = [
            { key: "customerInfo", values: orginationInfo.customerInfo ?? {} },
            { key: "docs", values: kycDoc },
          ];
          this.dynamicKeyHelper = ProductConstant.AccountDynamicKeys;
        }
      }
    });
  }
}
