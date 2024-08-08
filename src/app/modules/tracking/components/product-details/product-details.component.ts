import { Component, OnInit } from "@angular/core";
import { TrackingService } from "../../tracking-service";
import { ActivatedRoute } from "@angular/router";
import { forkJoin, of } from "rxjs";
import { ProductConstant } from "./product.store";
import { catchError } from "rxjs/operators";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.scss"]
})
export class ProductDetailsComponent implements OnInit {
  dynamicDetails: any = [];
  applicationStatus: any = [];
  mobileNumber: string;
  productType: string = "";

  statusItems: any[] = [];
  dynamicKeyHelper = {};

  loanDocument: any[] = [];

  constructor(private api: TrackingService, private route: ActivatedRoute) {}

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
      getLoanDocument: this.api
        .getLoanDocument(id)
        .pipe(catchError((err) => of({ error: err }))),
      applicationDetails: this.api
        .applicationDetails(id)
        .pipe(catchError((err) => of({ error: err }))),
      originationDetails: this.api
        .getOriginationMaster(id)
        .pipe(catchError((err) => of({ error: err }))),
      webSummary: this.productType.toLowerCase().includes("loan")
        ? this.api
            .getLoanSummary(id)
            .pipe(catchError((err) => of({ error: err })))
        : of(null)
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

        if (resp?.applicationDetails?.statusCode === 200) {
          this.applicationStatus = resp?.applicationDetails?.data;
          this.applicationStatus = this.applicationStatus.filter(
            (item: any) => item?.process
          );
          this.statusItems = this.applicationStatus.map((item: any) => {
            const val: any = {
              title: item?.process
            };
            if (item?.status === "DONE") {
              val.value = 100;
            }
            if (item?.status === "ONGOING") {
              val.value = 20;
            }
            if (item?.status === "REJECT") {
              val.value = 0;
            }
            return val;
          });
        }

        if (resp.getLoanDocument?.statusCode === 200) {
          const loanDoc = resp?.getLoanDocument?.data;
          this.loanDocument = loanDoc
            .filter((obj) => obj.docInfoModel)
            ?.map((item) => item?.docInfoModel?.[0]);
        }

        if (resp.webSummary?.statusCode === 200) {
          const loanInfo = resp.webSummary.data;
          const loanTenure = `${loanInfo.loanDetails.loanTenureYear} Year ${loanInfo.loanDetails.loanTenureMonth} Months ${loanInfo.loanDetails.loanTenureDay} Day`;

          this.dynamicDetails = [
            {
              key: "loanAccountInfo",
              values: { ...loanInfo.loanDetails, tenure: loanTenure }
            },
            { key: "bankAccount", values: loanInfo.bankAccount ?? {} },
            {
              key: "disbursementDetails",
              values: loanInfo.disbursementDetails ?? {}
            },
            { key: "customerInfo", values: orginationInfo.customerInfo ?? {} },
            {
              key: "documnentsInfo",
              // values: loanInfo.documnentsInfo.docInfoModel ?? []
              values: this.loanDocument ?? []
            },

            { key: "docs", values: kycDoc }
          ];
          this.dynamicKeyHelper = this.productType
            .toLowerCase()
            .includes("loan")
            ? ProductConstant.LoanDynamicKeys
            : ProductConstant.AccountDynamicKeys;
        } else {
          this.dynamicDetails = [
            { key: "customerInfo", values: orginationInfo.customerInfo ?? {} },
            { key: "docs", values: kycDoc }
          ];
          this.dynamicKeyHelper = ProductConstant.AccountDynamicKeys;
        }
      }
    });
  }
}
