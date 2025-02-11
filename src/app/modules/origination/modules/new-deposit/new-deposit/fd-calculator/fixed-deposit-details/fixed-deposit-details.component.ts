import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NewDepositService } from '../../../new-deposit.service';
import { FdCalculatorServiceService } from '../fd-calculator-service.service';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-fixed-deposit-details',
  templateUrl: './fixed-deposit-details.component.html',
  styleUrls: ['./fixed-deposit-details.component.scss'],
})
export class FixedDepositDetailsComponent implements OnInit, OnDestroy {
  REPORT_TITLE = 'Fixed Deposit';
  depositType = 'FD';
  createFdForm!: FormGroup;
  personalDetailsForm!: FormGroup;
  customVerifyNumber!: FormGroup;
  isFixedDepositDetail = false; // should be true
  isPersonalDetails = false;
  isBookFd = false;
  isVerifyNumber = false;
  @ViewChild('stepper') stepper: any;
  selectedStep = 0;
  customBasicForm: any;
  isLinear = true;
  steper_Array: any[] = [];
  cuurrentStep = 'Create FD';
  fdTypes: any;
  basisId: any;
  holderType: any;
  currentUserBranch: any;
  globalPayload: any;
  screenList: any = [];
  fdRdMasterId: any;
  fdDetails: any;
  customerInfo = [];
  existingCustomer: any;
  isEnabledEdit = false;
  saveTheEdit = false;
  docIds: any[] = [];
  staticData = {
    TYPESOFCUSTOMER: [],
    INTERESTPAYOUT: [],
    OWNERSHIP: [],
    PAYMENTTYPE: [],
  };
  typesOfCustomer: string[] | any;
  interestPayout: string[] | any;
  ownership: string[] | any;
  paymentType: string[] | any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  currentUser: User | null | undefined;
  constructor(
    private fb: FormBuilder,
    private fdApi: FdCalculatorServiceService,
    private snack: MatSnackBar,
    private cdref: ChangeDetectorRef,
    private newDepositeService: NewDepositService,
    private route: ActivatedRoute,
    private openAccountService: OpenAccountService,
    private store: Store,
    private sessionStorageSevice: SessionStorageService,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }
  ngOnInit(): void {
    this.getGenericDetails();
    this.newDepositeService.setToken(true);
    this.loadUserProfile();
    const sessionStep: any = this.sessionStorageSevice.getFdStep;
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    const id = this.route.snapshot.params['id'];
    if (id) this.dataByMasterId(parseInt(id));
    else this.buildCreateFdForm();
    const processCycleCode = this.route.snapshot.params['code'];
    if (processCycleCode) this.getAllFdStep(processCycleCode);
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
        if (this.currentUser) {
          this.currentUserBranch = this.currentUser?.branchId;
        }
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  getGenericDetails() {
    this.newDepositeService
      .genericValue('website', Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.typesOfCustomer = resp.data['TYPESOFCUSTOMER'];
          this.interestPayout = resp.data['INTERESTPAYOUT'];
          this.ownership = resp.data['OWNERSHIP'];
          this.paymentType = resp.data['PAYMENTTYPE'];
        }
      });
  }

  getAllFdStep(processCycleCode: any) {
    this.fdApi.getProcessCycle(processCycleCode).subscribe((resp) => {
      this.sessionStorageSevice.setCurrentStage(
        resp.data.processStageList[0].id,
      );
      this.fdApi
        .getProcessStages(resp.data.processStageList[0].id)
        .subscribe((resp) => {
          this.screenList = resp.data.screens.sort((s1: any, s2: any) => {
            return s1.sequence - s2.sequence;
          });
          this.factory();
        });
    });
  }

  dataByMasterId(fdMasterId: any) {
    this.fdApi.getOriginationMasterDetails(fdMasterId).subscribe((resp) => {
      if (resp.statusCode === 200) {
        this.fdDetails = resp.data[0];
        this.getOriginationMaster();
        this.buildCreateFdForm(resp.data[0]);
      }
    });
  }
  getOriginationMaster() {
    this.fdApi
      .getOriginationMaster(this.fdDetails.originationId)
      .subscribe((data) => {
        if (data.statusCode === 200) {
          this.customerInfo = data.data[0].customerInfo;
        }
      });
  }

  stepperSelectionChange(event: any) {
    this.cuurrentStep = this.screenList[event.selectedIndex].screenName;
    this.selectedStep = event.selectedIndex;
  }

  customSelectionChange(event: any) {
    console.log(event);
  }

  buildCreateFdForm(data?: any) {
    this.createFdForm = this.fb.group({
      amount: [data ? data?.amount : '', Validators.required],
      maturityDate: [
        data ? new Date(data.maturityDate) : '',
        Validators.required,
      ],
      intrestRate: [data ? data?.intrestRate : '', Validators.required],
      tenureYear: [data ? data?.tenureYear : ''],
      tenureMonth: [data ? data?.tenureMonth : ''],
      tenureDays: [data ? data?.tenureDays : ''],
      ownership: [data ? data?.ownership : '', Validators.required],
      maturityAmount: [data ? data?.maturityAmount : '', Validators.required],
      typeOfCustomer: [data ? data?.typeOfCustomer : '', Validators.required],
      intrestPayout: [data ? data?.intrestPayout : '', Validators.required],
      paymentType: [data ? data?.paymentType : '', Validators.required],
      autoRenew: [data ? data.autoRenew : false],
      fdRdMasterId: data && data.fdRdMasterId,
      originationProductId: data && data.originationProductId,
    });
    this.customBasicForm = this.createFdForm;
  }
  cancel() {
    window.close();
  }
  editRecord() {
    this.isEnabledEdit = true;
    this.saveTheEdit = true;
  }

  submitCreateFd() {
    delete this.fdDetails.intrestRate;
    delete this.fdDetails.amount;
    delete this.fdDetails.maturityDate;
    delete this.fdDetails.tenureDays;
    delete this.fdDetails.tenureMonth;
    delete this.fdDetails.tenureYear;
    delete this.fdDetails.ownership;

    const details = {
      ...this.fdDetails,
      ...this.createFdForm.value,
      maturityDate: moment(this.createFdForm.value.maturityDate).format(
        'DD-MMM-YYYY',
      ),
    };
    this.sessionStorageSevice.setOriginationId(this.fdDetails.originationId);
    this.sessionStorageSevice.setHolderType(this.createFdForm.value.ownership);
    const payload = {
      originationModel: details,
      customerInfo: this.createPayload(this.customerInfo),
    };
    this.fdApi.saveFdOriginationMaster(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.sessionStorageSevice.setFdRdMasterId(
          resp.data.fdRdMasterModel.fdRdMasterId,
        );
        this.snack.open(`Fixed Deposit Details Saved`, '!', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackbar-error',
        });
        this.isEnabledEdit = false;
        this.next();
        this.isFixedDepositDetail = false;
        this.isVerifyNumber = true;
      }
    });

    // });
  }

  createPayload(event: any) {
    const customer: any = [];
    event.forEach((element: any) => {
      const docIds = [];
      if (element?.documentId) {
        docIds.push(element.documentId);
      } else {
        element?.documnentsInfo?.documents.forEach((item: any) => {
          const docItemId: any = [];
          item.docs.forEach((docItem: any) => {
            docItemId.push(docItem.documentId);
          });
          const docId = {
            docIds: docItemId,
          };
          docIds.push(docId);
        });
      }
      const cus = {
        prefix: element.prefix,
        firstName: element.firstName,
        lastName: element.lastName,
        customerId: element?.customerId,
        middleName: '',
        gender: element.gender,
        jointCustomerInfo: [],
        documentId: element.primaryCustomer ? docIds : [],
        isphoneNumVerified: true,
        isEmailVerified: true,
        primaryCustomer: element.primaryCustomer ?? false,
        source: element.source,
        dateOfBirth: moment(element.dateOfBirth).format(),
        nationality: element.nationality,
        contact: {
          mobile: element.mobile,
          email: element.email,
          address: [
            {
              address1:
                element?.contact?.address[0].address1 ?? element.address1,
              address2: '',
              residenceType:
                element?.contact?.address[0].residenceType ??
                element.residenceType,
              cityId: element?.contact?.address[0].cityId ?? element.cityId,
              countryName:
                element?.contact?.address[0].countryName ?? element.country,
              pincode: element?.contact?.address[0].pincode ?? element.zipCode,
              stateName:
                element?.contact?.address[0].stateName ?? element.state,
            },
          ],
        },
      };
      customer.push(cus);
    });

    return customer;
  }

  customSavePersonal(event: any) {
    const fdData = {
      ...this.fdDetails,
    };
    delete fdData.fdRdMasterId;
    const customer = this.createPayload(event.personalDetails.value.customer);
    this.globalPayload = {
      originationModel: fdData,
      customerInfo: customer,
    };
    this.openAccountService.setData(this.globalPayload.customerInfo[0]);
    this.fdApi.saveFdOriginationMaster(this.globalPayload).subscribe((resp) => {
      if (resp.statusCode == 200 && resp.data) {
        resp.data?.customerInfo?.forEach((item: any) => {
          if (item.primaryCustomer)
            this.sessionStorageSevice.setCustomerId(item.customerId);
        });
        this.snack.open(`Personal Details Saved` + ' !', 'OK', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'snackbar-error',
        });
        this.customerInfo = resp.data?.customerInfo;
        this.next();
      }
    });
  }

  customSaveVerify() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.factory();
    this.isVerifyNumber = false;
    this.isPersonalDetails = true;
    this.cdref.detectChanges();
  }

  goBack() {
    const num = this.selectedStep - 1;
    this.selectedStep = num;
    this.sessionStorageSevice.setFdStep(String(this.selectedStep));
    this.factory();
  }
  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    this.sessionStorageSevice.setFdStep(String(this.selectedStep));
    this.factory();
  }
  customFormGroup(e: any) {
    this.personalDetailsForm = e;
  }

  onHolderTypeChange(e: any) {
    this.sessionStorageSevice.setHolderType(e);
    this.holderType = e;
  }
  onPaymentTypeChange(e: any) {
    this.sessionStorageSevice.setPaymentType(e);
  }

  factory() {
    this.cuurrentStep = this.screenList[this.selectedStep].screenName;
  }

  verifyStep(stepVerify: any) {
    return this.cuurrentStep.toLowerCase().includes(stepVerify) ? true : false;
  }

  customSaveDocuments(e: any) {
    const docIds: any = [];
    e.documentDetails.otherDocument.forEach((element: any) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });
    this.docIds = docIds;
    this.saveCustomerInfo(this.customerInfo, this.docIds);
  }
  saveCustomerInfo(resp: any, docIds: any) {
    const custResp: any = resp;
    custResp.forEach((item: any, i: any) => {
      custResp[i].documentId = [];
      if (item.primaryCustomer === true) custResp[i].documentId = docIds;
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
    });
    let fdData = this.fdDetails;
    delete fdData.fdRdMassterId;
    fdData = {
      ...fdData,
    };
    const payload = {
      originationModel: fdData,
      customerInfo: custResp,
    };
    this.fdApi.saveFdOriginationMaster(payload).subscribe((resp) => {
      this.sessionStorageSevice.setDepositOriginationId(
        resp.data.originationModel.originationId,
      );
      this.next();
    });
  }

  customExistingData(event: any) {
    if (event) {
      this.existingCustomer = event;
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
