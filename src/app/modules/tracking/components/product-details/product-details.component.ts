import { Component, OnInit } from "@angular/core";
import { TrackingService } from "../../tracking-service";
import { ActivatedRoute } from "@angular/router";
import { ProductConstant } from "./product.store";
import { forkJoin } from "rxjs/internal/observable/forkJoin";

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
    {
      title: "Application Submitted",
      value: 100,
    },
    {
      title: "Verification ",
      value: 20,
    },
    {
      title: "Application Status",
      value: 0,
    },
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
    return new Promise((resolve) => {
      let observabelConstant: any = {
        originationDtails: this.api.getOriginationMaster(id),
      };
      if (this.productType.toLowerCase().includes("loan")) {
        observabelConstant = {
          ...observabelConstant,
          webSummary: this.api.getLoanSummary(id),
        };
      }
      forkJoin(observabelConstant).subscribe((resp: any) => {
        if (resp?.originationDtails.statusCode === 200) {
          const orginationInfo = resp.originationDtails.data[0];
          const kycDoc = [];
          orginationInfo.customerInfo.forEach((obj) => {
            if (obj?.primaryCustomer) {
              obj.documnentsInfo.documents.forEach((objDoc) => {
                objDoc.docs.forEach((doc) => {
                  kycDoc.push(doc);
                });
              });
            }
          });
          if (
            resp?.webSummary?.statusCode === 200 &&
            this.productType.toLowerCase().includes("loan")
          ) {
            const loanInfo = resp.webSummary.data;

            this.dynamicDetails = [
              {
                key: "loanAccountInfo",
                values: {
                  ...loanInfo.loanDetails,
                  tenure: `${loanInfo.loanDetails?.loanTenureYear} Year ${loanInfo.loanDetails?.loanTenureMonth} Months ${loanInfo.loanDetails?.loanTenureDay} Day`,
                },
              },
              {
                key: "bankAccount",
                values: loanInfo?.bankAccount ?? {},
              },
              {
                key: "disbursementDetails",
                values: loanInfo?.disbursementDetails ?? {},
              },
              {
                key: "customerInfo",
                values: orginationInfo.customerInfo ?? {},
              },
              {
                key: "documnentsInfo",
                values: loanInfo?.documnentsInfo?.docInfoModel ?? [],
              },
              {
                key: "docs",
                values: kycDoc,
              },
            ];
            this.dynamicKeyHelper = ProductConstant.LoanDynamicKeys;
          } else {
            this.dynamicDetails = [
              {
                key: "customerInfo",
                values: orginationInfo.customerInfo ?? {},
              },
              {
                key: "docs",
                values: kycDoc,
              },
            ];
            this.dynamicKeyHelper = ProductConstant.AccountDynamicKeys;
          }
        }
      });
    });
  }
}
