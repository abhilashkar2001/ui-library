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
    this.mobileNumber = sessionStorage.getItem("trackingMobile");
    this.getOriginationById(id);
  }

  getOriginationById(id) {
    // this.api.getLoanSummary(id).subscribe((resp: any) => {
    //   this.dynamicDetails = [
    //     {
    //       key: "loanAccountInfo",
    //       values: {
    //         ...resp.data.loanDetails,
    //         tenure: `${resp.data.loanDetails?.loanTenureYear} Year ${resp.data.loanDetails?.loanTenureMonth} Months ${resp.data.loanDetails?.loanTenureDay} Day`,
    //       },
    //     },
    //     {
    //       key: "bankAccount",
    //       values: resp.data?.bankAccount ?? {},
    //     },
    //     {
    //       key: "disbursementDetails",
    //       values: resp.data?.disbursementDetails ?? {},
    //     },
    //     {
    //       key: "documnentsInfo",
    //       values: resp.data?.documnentsInfo?.docInfoModel ?? [],
    //     },
    //   ];

    //   this.dynamicKeyHelper = ProductConstant.LoanDynamicKeys;
    // });

    // this.api.getOriginationMaster(id).subscribe((resp) => {
    // });
    this.getWebSummary(id);
  }

  getWebSummary(id) {
    return new Promise((resolve) => {
      forkJoin({
        webSummary: this.api.getLoanSummary(id),
        originationDtails: this.api.getOriginationMaster(id),
        // branch: this.api.getBranchCode(),
      }).subscribe((resp: any) => {
        console.log(resp);

        if (resp.webSummary.statusCode === 200) {
          const loanInfo = resp.webSummary.data;
          const orginationInfo = resp.originationDtails.data[0];
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
          ];
        }

        this.dynamicKeyHelper = ProductConstant.LoanDynamicKeys;
      });
    });
  }
}
