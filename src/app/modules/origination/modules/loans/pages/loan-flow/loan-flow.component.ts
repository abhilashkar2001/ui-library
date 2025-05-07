import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessPopupComponent } from 'app/shared/components/success-popup/success-popup.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import {
  LocaleData,
  selectLocaleData,
  TokenStorageService,
} from '@onerumango/utils';
import * as moment from 'moment';
import { CreateLoanEnum, LoanFlowConstants } from './loan-flow.constant';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { DataService } from 'app/shared/services/table-service/data.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { selectUser } from '@onerumango/utils';
import { User } from '@onerumango/utils';
import { CustomWebDocUploadServiceService } from '../../../shared-origination/cusotm-web-doc-upload/custom-web-doc-upload-service.service';
import { ReusableAlertPopupComponent } from '../../../shared-origination/reusable-alert-popup/reusable-alert-popup.component';
import { WebhostDirective } from '../../../../../../shared/directives/appHost.directive';

@Component({
  selector: 'app-loan-flow',
  templateUrl: './loan-flow.component.html',
  styleUrls: ['./loan-flow.component.scss'],
})
export class LoanFlowComponent implements OnInit, OnDestroy {
  originationValue$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  @ViewChild('stepper') stepper: any;
  selectedStep = 0;
  cuurrentStep: string | any;
  screenList: any = [];
  screenTitle = 'Personal Loan';
  originationId: any;
  loanSummary: any;
  customerData: any;
  customHeader = LoanFlowConstants.CUSTOM_HEADER;
  createLoanAccountNumber: any;
  customerInfo: any;
  docIds: any[] | any;
  originationModel: any;
  basisId: number | undefined;
  productDetails: any;
  processDetails: { processCycleCode: string; processStageId: number } | any;
  personalDetails: any = [];
  staticData = {
    OWNERSHIP: [],
  };
  currentUser: User | undefined;
  isLoading = false;
  dynamicScreen = LoanFlowConstants.DYNAMIC_SCREEN;
  @ViewChild('container') container: any;
  @ViewChild(WebhostDirective, { static: true }) appAppHost!: WebhostDirective;
  componentRef: any;
  currentComponentInfo: any;
  mobileVerifyInfo = {
    basisName: '',
    productDuplicationKey: 'Loan',
    applicationType: 'loan application',
    individual: false,
  };
  personalDoc: any[] = [];
  loanAccountInfo: any;
  otherLoanDoc: any = null;
  kycDoc: any = null;
  docCustomerDetails: any;
  disbursementDetails: any;
  nationalIdDocumentList: any[] = [];
  view: any;
  noOfDirectors: number | any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  private localeData: LocaleData | undefined;

  constructor(
    private loanApi: LoanService,
    private openAccountService: OpenAccountService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    protected cdr: ChangeDetectorRef,
    private dataService: DataService,
    private docapi: CustomWebDocUploadServiceService,
    private store: Store,
    private sessionStorageService: SessionStorageService,
    private tokenStorageService: TokenStorageService,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  /**
   * creating dynamically view of screen by iterating 'dynamicScreen' json object which match screenName.
   *  & find componentName and load the component.
   * @param screenName current scrrenName.
   */
  showComponent(screenName: any) {
    if (this.view) this.view.clear();
    if (
      this.dynamicScreen.some((element) =>
        screenName.toLowerCase().includes(element.key),
      )
    ) {
      this.dynamicScreen.forEach((item: any) => {
        if (screenName.toLowerCase().includes(item.key)) {
          this.currentComponentInfo = { ...item };
          this.view = this.appAppHost.viewContainerRef;
          setTimeout(() => {
            this.componentRef = this.view.createComponent(item.component);
            if (this.noOfDirectors)
              this.componentRef.instance.numberOfDirectors = this.noOfDirectors;
            // for mobile number.
            console.log(this.mobileVerifyInfo);
            this.componentRef.instance.mobileVerifyInfo = this.mobileVerifyInfo;
            // for personal details.
            this.componentRef.instance.basisId = this.basisId;

            // to pass screenInfo
            this.componentRef.instance.screenInfo =
              this.screenList[this.selectedStep];
            this.componentRef.instance.personalDetails = this.personalDetails;
            this.componentRef.instance.docCustomerDetails =
              this.docCustomerDetails;

            // national Doc
            this.componentRef.instance.nationalIdDocumentList =
              this.nationalIdDocumentList;
            this.componentRef.instance.personalDoc = this.personalDoc;
            this.componentRef.instance.isMasterSave = true;

            this.componentRef.instance.accountType = 'loan';

            this.componentRef.instance.updateParentModel = this.updateAccount;
            this.componentRef.instance?.CustomSubmit?.subscribe((data: any) => {
              console.log(data);
              if (data?.value?.accountNumber)
                this.createLoanAccountNumber = data.value.accountNumber;

              if (data?.personalInfo) {
                this.personalDetails = data.personalInfo;
                this.personalDetails.forEach((item: any) => {
                  if (item.primaryCustomer)
                    this.personalDoc = item?.documentInfo;
                });
              }
              console.log(screenName);
              if (screenName.toLowerCase().includes('director')) {
                this.customSavePersonal(data);
              } else if (screenName.toLowerCase().includes('company')) {
                this.customSaveCompany(data);
              } else if (
                screenName.toLowerCase().includes('signature') ||
                data?.isNext == true
              ) {
                this.next();
              }
            });
            if (this.componentRef.instance?.onMobileExitEvent)
              this.componentRef.instance?.onMobileExitEvent.subscribe(() => {
                this.router.navigate(['/loan/landing']);
              });
            if (this.componentRef.instance?.backEvent)
              this.componentRef.instance?.backEvent.subscribe(() => {
                this.goBack();
              });
          });
        }
      });
    } else {
      const dialogRef = this.dialog.open(ReusableAlertPopupComponent, {
        data: {
          msg: `${screenName} stage is not avilable, please move to next stage`,
          isNextButton: true,
        },
        width: '40%',
        panelClass: 'popup-dialog-class',
      });
      dialogRef.afterClosed().subscribe((_) => {
        this.next();
      });
    }
  }

  /**
   * it will check the updateMasterSave key if its true it will call master-save or else it will move to next screen.
   * @param value inputValue of child screen
   */
  updateAccount = (value: Partial<any>) => {
    const isLoan = value?.['isForLoan'] ?? true;
    if (value?.['kycDoc']) {
      this.kycDoc = value?.['kycDoc'];
    }
    this.docCustomerDetails = value?.['customerDetails'];
    // const originationModel = {
    //   ...this.factorizedPayload(),
    // };
    // const customerInfo = this.modelFactoryForCustomer(
    //   this.personalDetails,
    //   value?.['kycDoc'] ?? null,
    // );
    if (value?.['isCheckListDoc']) {
      const payload = {
        documentIds: value?.['otherLoanDoc'],
        originationId:
          this.originationModel?.originationId ??
          this.sessionStorageService.getOriginationId(),

        screenCode: this.sessionStorageService.getCurrentScreenCode(),
      };
      this.loanApi.saveChecklist(payload).subscribe((resp) => {
        if (resp?.statusCode === 201) {
          this.sessionStorageService.setOtherDocScreenCode(
            this.sessionStorageService.getCurrentScreenCode(),
          );
        }
      });
    }
    // if (
    //   value['updateMasterSave'] &&
    //   isLoan &&
    //   this.personalDetails?.length > 0
    // ) {
    //   this.getMasterSave({
    //     originationModel: originationModel,
    //     customerInfo: customerInfo,
    //   });
    // } else {
    if (!isLoan) return;
    else this.next();
    // }
  };

  calculateDisbursementPayload(data: any) {
    const store = this.currentUser;
    const payload: any = {
      ...this.disbursementDetails,
      disbursementType: data.disbursementType,
      bankCode: store?.bankCode,
      branchCode: store?.branchId,
      originationId: this.sessionStorageService.getOriginationId(),
    };

    if (
      data.disbursementTypeValue.includes(
        CreateLoanEnum.ACCOUNT_INCLUDES_KEY,
      ) &&
      data?.accountType === CreateLoanEnum.EXTERNAL
    ) {
      payload.otherAccNo = data.accountNumber;
      payload.accountNumber = null;
      payload.external = true;
    } else {
      payload.otherAccNo = '';
      payload.accountNumber = data.accountNumber;
      payload.external = false;
    }
    payload.disbursementAccInfo = {
      accountNo: data.accountNumber,
      bankCode: store?.bankCode,
      branchCode: store?.branchId,
    };
    return payload;
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadLocaleData();
    this.basisId = this.route.snapshot.params['id'];
    const sessionStep = this.sessionStorageService.getLoanStep();
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    this.getAllLoanStep().then(() => {
      this.getProductDetails();
      const originationId = this.sessionStorageService.getOriginationId();
      const customerId: any = this.sessionStorageService.getUserCustomerId();
      const customerStageId: any =
        this.sessionStorageService.getCustomerStageId();

      if (originationId) this.getOriginationMaster(parseInt(originationId));
      else if (customerStageId) {
        this.getCustByStageId();
      } else if (customerId) {
        this.getCustomerById();
      }
    });
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  loadLocaleData() {
    const localeDataSub = this.store
      .select(selectLocaleData)
      .subscribe((res) => {
        if (res) {
          this.localeData = res;
        }
      });

    this.subscriptions.push(localeDataSub);
  }

  getCustomerById() {
    setTimeout(() => {
      this.fetchCustomersbyId().then((resp) => {
        this.personalDetails = resp;
        // this.componentRef.instance.personalDetails = this.personalDetails;
      });
    }, 500);
  }

  getCustByStageId() {
    setTimeout(() => {
      this.fetchCustomers().then((resp) => {
        this.personalDetails = resp;
      });
    }, 500);
  }

  /**
   * api call for getting product details by basisId
   */
  getProductDetails() {
    this.loanApi.getProductDetails(this.basisId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.length > 0) {
        this.productDetails = resp.data[0];
        this.cdr.detectChanges();
        this.mobileVerifyInfo = {
          ...this.mobileVerifyInfo,
          basisName: this.productDetails.basisName,
          individual: resp?.data[0]?.individual,
        };
        console.log(this.mobileVerifyInfo);
        this.showComponent(this.cuurrentStep);
        this.cdr.detectChanges();
      }
    });
  }

  getOriginationMaster(id: any) {
    this.loanApi.getOriginationMaster(parseInt(id)).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.length > 0) {
        this.customerInfo = resp.data[0]?.customerInfo;
        this.personalDetails = resp.data[0]?.customerInfo;
        this.originationId = resp.data[0].originationModel.originationId;
        this.originationModel = resp.data[0]?.originationModel;
        this.updateNationalId(resp);
        if (this.componentRef)
          this.componentRef.instance.personalDetails = this.personalDetails;
        this.cdr.detectChanges();
      }
    });
  }
  updateNationalId(resp: any) {
    console.log(resp.data[0].customerInfo?.length);
    if (resp.data[0].customerInfo?.length > 0) {
      resp.data[0].customerInfo.forEach((customer: any) => {
        if (customer?.primaryCustomer) {
          if (customer?.documnentsInfo) {
            this.nationalIdDocumentList = customer?.documnentsInfo?.documents;
            if (this.componentRef)
              this.componentRef.instance.nationalIdDocumentList =
                this.nationalIdDocumentList;
          }
        }
      });
    }
  }

  getAllLoanStep() {
    return new Promise((resolve) => {
      const sessionData = this.sessionStorageService.getLoanBasisDetails();
      this.screenTitle = sessionData.basisName;
      this.screenTitle = sessionData.basisName;
      this.openAccountService
        .getProcessCycle(sessionData.processCycleCode)
        .subscribe((resp) => {
          this.processDetails = {
            id: resp?.data?.id,
            processCycleCode: resp?.data?.processCycleCode,
            processStageId: resp?.data?.processStageList[0]?.id,
          };
          this.sessionStorageService.setCurrentStage(
            resp.data?.processStageList[0].id,
          );
          this.getProcessStages(resp.data?.processStageList[0].id);
          resolve('');
        });
    });
  }

  getProcessStages(id: any) {
    this.openAccountService.getProcessStages(id).subscribe((resp) => {
      this.screenList = resp.data.screens.sort((s1: any, s2: any) => {
        return s1.sequence - s2.sequence;
      });
      this.factory();
    });
  }

  /**
   *
   * @param customerInfo is a customerInfo model
   * @param docIds is a document model
   * @returns payload of customerInfo.
   */
  modelFactoryForCustomer(customerInfo: any, docIds: any) {
    if (this.personalDetails?.length > 0) {
      const custResp: any =
        customerInfo?.length > 1 ? customerInfo : [...customerInfo];
      custResp.forEach((item: any, i: any) => {
        custResp[i].documentId = [];
        custResp[0].primaryCustomer = true; //Need to remove lator while multiple customer
        if (item.primaryCustomer === true) custResp[i].documentId = docIds;
        if (this.noOfDirectors)
          custResp[i].corpDirectorModel = {
            sharePercentage: 100 / this.noOfDirectors,
            isManagingDirector: custResp[i]?.primaryCustomer,
          };
        delete custResp[i]?.biometricInfo;
        delete custResp[i]?.documnentsInfo;
        delete custResp[i]?.documentsInfoModel;
        delete custResp[i]?.signatureInfo;
      });

      return custResp;
    }
  }

  /**
   *
   * @returns a payload object for the orgination model.
   */
  factorizedPayload() {
    const sessionData: any = this.sessionStorageService.getLoanBasisDetails();
    const loanData = this.sessionStorageService.getLoanAmount();
    const ownershipId = this.sessionStorageService.getOwnershipId();
    const originationId = this.sessionStorageService.getOriginationId();
    const emiData = this.sessionStorageService.getEmiData();

    if (loanData) {
      const payload = {
        loanDetails: {
          loanAmount: parseInt(loanData.loanAmount),
          loanTenureDay: emiData?.loanTenureDay,
          loanTenureMonth: emiData?.loanTenureMonth,
          loanTenureYear: emiData?.loanTenureYear,
        },
        originationModel: {
          originationId:
            this.originationModel?.originationId ?? originationId ?? null,
          applicationDate: moment(new Date()).format('MM-DD-YYYY'),
          accountType: sessionData.basisName,
          originationProductId: sessionData.basisId,
          source: 'Website',
          businessProductName: this.productDetails.basisName,
          productDescription: this.productDetails.basisDetailStory,
          currencyCode: this.localeData?.currency,
          currencyId: this.currentUser?.currencyId,
          branchId: this.currentUser?.branchId,
          ownership: ownershipId,
          documentId: this.otherLoanDoc?.length > 0 ? this.otherLoanDoc : null,
          department: this.currentUser?.department,
        },
      };
      return payload;
    } else return;
  }

  stepperSelectionChange(event: any) {
    const lastStep = this.selectedStep;
    this.cuurrentStep = this.screenList[event.selectedIndex].screenName;
    this.sessionStorageService.setLoanStep(event.selectedIndex);
    this.selectedStep = event.selectedIndex;
    this.sessionStorageService.setCurrentScreenCode(
      this.screenList[this.selectedStep].screenCode,
    );
    if (lastStep != event.selectedIndex) this.showComponent(this.cuurrentStep);
  }
  factory() {
    this.cuurrentStep = this.screenList[this.selectedStep]?.screenName;
    this.sessionStorageService.setCurrentScreenCode(
      this.screenList?.[this.selectedStep]?.screenCode,
    );
    this.showComponent(this.cuurrentStep);
  }
  next() {
    const num = this.selectedStep + 1;
    if (num === this.screenList?.length && num > 0) {
      this.onFlowDone();
      return;
    } else {
      this.selectedStep = num;
      this.sessionStorageService.setLoanStep(String(this.selectedStep));
      this.sessionStorageService.setCurrentScreenCode(
        this.screenList[this.selectedStep].screenCode,
      );
      this.factory();
      window.scrollTo(0, 0);
    }
  }

  getCustInfoPayload(event: any, prefixValue: any) {
    return new Promise((resolve) => {
      const customer: any = [];
      event.forEach((element: any, i: any) => {
        if (element.primaryCustomer) {
          this.sessionStorageService.setCustomerData(
            JSON.stringify({
              name: `${prefixValue}. ${element.firstName} ${element.lastName}`,
              cifNumber:
                element.kycStatus === 'APPROVED' ? element.customerNo : '',
            }),
          );
        }
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
          ...element,
          jointCustomerInfo: [],
          middleName: '',
          dateOfBirth: moment(element.dateOfBirth).format(),
          documentId: this.kycDoc?.[i] ? [this.kycDoc?.[i]] : null,
          biometricId: this.sessionStorageService.getBiometricId()
            ? [this.sessionStorageService.getBiometricId()]
            : null,
        };
        customer.push(cus);
      });
      resolve(customer);
    });
  }

  getOriginationModelForLoan() {
    const sessionData = this.sessionStorageService.getLoanBasisDetails();
    const loanData = this.sessionStorageService.getLoanAmount();
    const ownershipId = this.sessionStorageService.getOwnershipId();
    const emiData = this.sessionStorageService.getEmiData();
    return {
      originationId:
        this.originationModel?.originationId ??
        this.sessionStorageService.getOriginationId() ??
        null,
      applicationDate: moment(new Date()).format('MM-DD-YYYY'),
      accountType: sessionData.basisName,
      originationProductId: sessionData.basisId,
      loanAmount: parseInt(loanData.loanAmount),
      loanTenureDay: emiData?.loanTenureDay,
      loanTenureMonth: emiData?.loanTenureMonth,
      loanTenureYear: emiData?.loanTenureYear,
      branchCode: this.currentUser?.branch,
      source: 'Website',
      businessProductName: null,
      productDescription: null,
      currencyCode: this.localeData?.currency,
      branchId: this.currentUser?.branch,
      ownership: ownershipId,
      documentId: this.otherLoanDoc ?? null,
      department: this.currentUser?.department,
    };
  }

  // company details save
  customSaveCompany(data: any) {
    const payload = data?.companyDetails.value;
    payload.originationModel = this.getOriginationModelForLoan();
    this.openAccountService
      .saveCustomerInfo(payload)
      .subscribe(async (resp) => {
        if (
          (resp?.statusCode == 200 || resp?.statusCode == 201) &&
          resp?.data
        ) {
          this.noOfDirectors = resp?.data?.corporateCustomer?.numberOfDirectors;
          this.sessionStorageService.setOriginationId(
            resp?.data?.originationModel?.originationId,
          );
          this.next();
        }
      });
  }

  // on Personal details saved
  customSavePersonal(event: any) {
    const payload = event.personalDetails.value.customer;
    payload.forEach((item: any) => {
      delete item.prefixValue;
      item.customerId = null;
    });
    this.getCustInfoPayload(
      event.personalDetails.value.customer,
      event.prefixValue,
    ).then((data) => {
      const payloadData = {
        ...this.factorizedPayload(),
        customerInfo: data,
        screenCode: this.screenList[this.selectedStep].screenCode,
      };
      this.openAccountService
        .saveCustomerInfo(payloadData)
        .subscribe(async (resp) => {
          if (resp.statusCode === 200) {
            this.originationModel = resp.data?.originationModel;
            this.personalDetails = resp.data?.customerInfo;
            this.loanAccountInfo = resp.data?.loanAccountInfo;
            this.originationValue$ = resp.data;
            const customId: any = [];
            for (const item of resp.data.customerInfo) {
              customId.push(item.customerId || item?.custStagingId);
              if (item.primaryCustomer)
                this.sessionStorageService.setCustomerStagingId(
                  item.custStagingId,
                );
            }
            this.snack.open(`Personal Details Saved` + ' !', 'OK', {
              duration: 4000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'snackbar-error',
            });
            this.sessionStorageService.setCustomerStageId(customId);
            this.customerInfo = resp.data?.customerInfo;
            this.sessionStorageService.setOriginationId(
              resp?.data?.originationModel?.originationId,
            );
            this.sessionStorageService.removeLoanDoc();
            if (!this.mobileVerifyInfo.individual) {
              const formdataMap: Map<string, Record<string, any>> | any =
                this.dataService.getChecklistDocument();
              const docIds: number[] = [];
              for (const item of formdataMap) {
                docIds.push(item?.documentId);
                const formData = new FormData();
                formData.append('fileName', item?.file);
                await this.docapi
                  .getCheckListDoc(
                    item?.docName,
                    resp?.data?.originationModel?.originationId,
                    formData,
                    item?.documentId,
                  )
                  .toPromise();
              }
              if (this.mobileVerifyInfo) {
                const payload = {
                  documentIds: docIds,
                  originationId:
                    this.originationModel?.originationId ??
                    this.sessionStorageService.getOriginationId(),
                  screenCode:
                    this.sessionStorageService.getOtherDocScreenCode(),
                };
                await this.loanApi.saveChecklist(payload).toPromise();
                await this.loanApi
                  .submitLoanDetail(
                    this.calculateDisbursementPayload(
                      this.dataService.getDisbursementDetails(),
                    ),
                  )
                  .toPromise();
              }
            }

            this.next();
          }
        });
    });
  }

  fetchCustomersbyId() {
    const customIds = this.sessionStorageService.getUserCustomerId();
    return new Promise((resolve) => {
      const promises = customIds.map((id: any) => {
        return new Promise((innerResolve) => {
          this.openAccountService.getCustomerById(id).subscribe((resp) => {
            if (resp?.statusCode === 200)
              innerResolve({
                ...resp.data[0],
                customerId: null,
                customerNo: null,
                contact: {
                  ...resp.data[0].contact,
                  contactId: null,
                  address: [
                    { ...resp.data[0].contact.address[0], addressId: null },
                  ],
                },
              });
            else innerResolve(null); // or handle rejection if needed
          });
        });
      });
      Promise.all(promises).then((customers) => {
        const filteredCustomers = customers.filter(
          (customer) => customer !== null,
        );
        resolve(filteredCustomers);
      });
    });
  }

  fetchCustomers() {
    const customIds = this.sessionStorageService.getCustomerStageId();
    return new Promise((resolve) => {
      const promises = customIds.map((id: any) => {
        return new Promise((innerResolve) => {
          this.loanApi.getCustByStageId(id).subscribe((resp) => {
            if (resp?.statusCode === 200)
              innerResolve({
                ...resp.data[0],
                customerId: null,
                customerNo: null,
                contact: {
                  ...resp.data[0].contact,
                  contactId: null,
                  address: [
                    { ...resp.data[0].contact.address[0], addressId: null },
                  ],
                },
              });
            else innerResolve(null); // or handle rejection if needed
          });
        });
      });
      Promise.all(promises).then((customers) => {
        const filteredCustomers = customers.filter(
          (customer) => customer !== null,
        );
        resolve(filteredCustomers);
      });
    });
  }

  getMasterSave(payload: any) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode == 200 && resp?.data) {
        this.sessionStorageService.setOriginationId(
          resp?.data?.originationModel?.originationId,
        );
        this.next();
      }
    });
  }

  onFlowDone() {
    const originationId = this.sessionStorageService.getOriginationId();
    const payload: any = {};
    payload.properties = {};
    payload.screenCode = null;
    payload.processStageId = null;
    payload.processCycleId = this.processDetails?.id;
    payload.originationId = originationId;
    payload.action = 'Submit';
    payload.transactionType = 'IND_LOAN';

    this.loanApi.verifyWorkFlow(payload).subscribe((resp: any) => {
      if (resp?.status === 200) {
        const dialogRef = this.dialog.open(SuccessPopupComponent, {
          data: {
            originationId: originationId,
            loanSummary: this.loanSummary,
            customHeader: this.customHeader,
            type: 'loan',
            isComplete: resp?.data?.isComplete,
            message:
              'Your loan application is sent. The bank will contact you soon.',
          },
          width: '55%',
          disableClose: true,
          panelClass: 'ic-dialog__panelclass',
          backdropClass: 'bdrop',
        });
        dialogRef.afterClosed().subscribe((resp) => {
          if (resp === true) {
            this.tokenStorageService.clearSessionExceptLoginInfo();
            this.router.navigate(['origination/loan/landing']);
          } else if (resp === 'tracking') {
            this.tokenStorageService.clearSessionExceptLoginInfo();
          }
        });
      }
    });
  }

  goBack() {
    const num = this.selectedStep - 1;
    this.cuurrentStep = this.screenList[num].screenName;
    setTimeout(() => {
      this.selectedStep = num;
      this.factory();
    }, 200);
  }

  checkBtnValidity() {
    return this.cuurrentStep?.toLowerCase().includes('loan document');
  }

  addDoc() {
    this.loanApi.addNewUpload();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
