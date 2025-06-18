import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { ProductConstant } from './product.store';
import { catchError } from 'rxjs/operators';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { LoanService } from '../../../../../../shared/services/loan/loan.service';
import { TrackingService } from '../../tracking-service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  dynamicDetails: any = [];
  applicationStatus: any = [];
  mobileNumber: string | any;
  productType = '';

  statusItems: any[] = [];
  dynamicKeyHelper = {};

  loanDocument: any[] = [];

  constructor(
    private api: TrackingService,
    private loanService: LoanService,
    private route: ActivatedRoute,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.route.queryParamMap.subscribe((params: any) => {
      this.productType = params.get('type');
    });
    this.mobileNumber = this.sessionStorageService.getTrackingMobile();
    this.getOriginationById(id);
  }

  getOriginationById(id: any) {
    this.getWebSummary(id);
  }

  getWebSummary(id: any) {
    const observables = {
      getLoanDocument: this.loanService
        .getSavedChecklist(id)
        .pipe(catchError((err) => of({ error: err }))),
      applicationDetails: this.api
        .applicationDetails(id)
        .pipe(catchError((err) => of({ error: err }))),
      originationDetails: this.loanService
        .getOriginationMaster(id)
        .pipe(catchError((err) => of({ error: err }))),
      webSummary: this.productType.toLowerCase().includes('loan')
        ? this.loanService
            .getLoanSummary(id)
            .pipe(catchError((err) => of({ error: err })))
        : of(null),
    };

    forkJoin(observables).subscribe((resp: any) => {
      const originationDetails = resp.originationDetails;
      if (originationDetails?.statusCode === 200) {
        const orginationInfo = originationDetails.data[0];
        const kycDoc = orginationInfo.customerInfo
          .filter((customer: any) => customer.primaryCustomer)
          .flatMap((customer: any) => customer.documentInfo);
        if (resp?.applicationDetails?.statusCode === 200) {
          this.applicationStatus = resp?.applicationDetails?.data;
          this.applicationStatus = this.applicationStatus.filter(
            (item: any) => item?.process,
          );
          this.statusItems = this.applicationStatus.map((item: any) => {
            const val: any = {
              title: item?.process,
              status: item?.status,
            };
            if (
              item?.status === 'DONE' ||
              item?.status === 'APPROVED' ||
              item?.status === 'COMPLETED'
            ) {
              val.value = 100;
            }
            if (item?.status === 'PENDING') {
              val.value = 50;
            }
            if (item?.status === 'ONGOING') {
              val.value = 20;
            }
            if (item?.status === 'REJECT' || item?.status === 'EXPIRED') {
              val.value = 100;
            }
            return val;
          });
        }

        if (resp.getLoanDocument?.statusCode === 200) {
          const loanDoc = resp?.getLoanDocument?.data;
          this.loanDocument = loanDoc
            .filter((obj: any) => obj.docInfoModel)
            ?.map((item: any) => item?.docInfoModel?.[0]);
        }
        if (resp.webSummary?.statusCode === 200) {
          const loanInfo = resp.webSummary?.data;
          const loanTenure = `${loanInfo?.loanDetail?.loanTenureYear} Year ${loanInfo?.loanDetail?.loanTenureMonth} Months ${loanInfo?.loanDetail?.loanTenureDay} Day`;
          this.dynamicDetails = [
            {
              key: 'loanAccountInfo',
              values: { ...loanInfo.loanDetail, tenure: loanTenure },
            },
            { key: 'bankAccount', values: loanInfo.bankAccount ?? {} },
            {
              key: 'disbursementDetails',
              values: {
                ...(loanInfo?.loanDisbursementModel ?? {}),
                ...(loanInfo?.loanDisbursementModel?.disbursementAccount ?? {}),
                ...(loanInfo?.repaymentModel ?? {}),
                disbursementModeValue:
                  loanInfo?.loanDisbursementModel?.disbursementAccount
                    ?.disbursementModeValue ??
                  loanInfo?.loanDisbursementModel?.disbursementModeValue ??
                  loanInfo?.repaymentModel?.disbursementModeValue ??
                  null,
                firstRepaymentDate:
                  loanInfo?.repaymentModel?.firstRepaymentDate ?? null,
                customerName:
                  loanInfo?.loanDisbursementModel?.disbursementAccount
                    ?.customerName ??
                  loanInfo?.loanDisbursementModel?.customerName ??
                  null,
              },
            },

            { key: 'customerInfo', values: orginationInfo.customerInfo ?? {} },
            {
              key: 'documnentsInfo',
              values: this.loanDocument ?? [],
            },
            { key: 'docs', values: kycDoc },
          ];
          this.dynamicKeyHelper = this.productType
            .toLowerCase()
            .includes('loan')
            ? ProductConstant.LoanDynamicKeys
            : ProductConstant.AccountDynamicKeys;
        } else {
          this.dynamicDetails = [
            { key: 'customerInfo', values: orginationInfo.customerInfo ?? {} },
            { key: 'docs', values: kycDoc },
          ];
          this.dynamicKeyHelper = ProductConstant.AccountDynamicKeys;
        }
      }
    });
  }
}
