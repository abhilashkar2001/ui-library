import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorNotifierPopupComponent } from 'app/shared/components/error-notifier-popup/error-notifier-popup.component';
import { SuccessPopupComponent } from 'app/shared/components/success-popup/success-popup.component';
import { LoanService } from 'app/shared/services/loan/loan.service';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { SharedService } from 'app/shared/shared.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import * as moment from 'moment';
import { CreateAccountConstant, CreateEnum } from './create-account.constant';
import { AppHostDirective } from 'app/shared/directives/app-host.directive';
import { EmailService } from 'app/shared/services/email.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { Observable, Subscription } from 'rxjs';
import { User } from 'app/shared/store/models/user.model';
import { Store } from '@ngrx/store';
import { selectUser } from 'app/shared/store/selector/user-profileInfo.selector';

const { OWNERSHIP, PRODUCT_DUPLICATION_KEY, SOURCE_PAYLOAD_KEY, LOADING_TEXT } =
  CreateEnum;

@Component({
  selector: 'app-create-account-landing-page',
  templateUrl: './create-account-landing-page.component.html',
  styleUrls: ['./create-account-landing-page.component.scss'],
})
export class CreateAccountLandingPageComponent implements OnInit, OnDestroy {
  stepper: MatStepper | any;
  screenList: any;
  screenTitle = '';
  selectedStep = 0;
  currentStep: string | any;
  originationId: any;
  basisId: any;
  productDetails: any;
  processDetails: { processCycleCode: string; processStageId: number } | any;
  personalDetails: any = [];
  ownership: any;
  screenName: string = CreateAccountConstant.SCREEN_NAME;
  staticData = CreateAccountConstant.STATIC_DATA;
  ownershipId: any;
  currentUser: any;
  currencyCode: any;
  isHideField = true;
  personalDoc: any[] = [];
  isLoading = false;
  dynamicScreen = CreateAccountConstant.DYNAMIC_SCREEN;
  @ViewChild('container') container: any;
  @ViewChild(AppHostDirective, { static: true }) appAppHost:
    | AppHostDirective
    | any;
  componentRef: any;
  currentComponentInfo: any;
  existingCustomerId: number | any;
  mobileVerifyInfo = {
    basisName: '',
    productDuplicationKey: PRODUCT_DUPLICATION_KEY,
    applicationType: 'Create Account application',
    individual: '',
  };
  originationModel: any;
  view: any;
  kycDoc: any = [];
  docCustomerDetails: any;
  noOfDirectors: number | any;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private dialog: MatDialog,
    private loanApi: LoanService,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private emailService: EmailService,
    private sessionStorageService: SessionStorageService,
    private commonService: CommonService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
    this.commonService.updateData(router.url);
  }

  showComponent(screenName: any) {
    if (
      this.dynamicScreen.some((item) =>
        screenName.toLowerCase().includes(item.key),
      )
    ) {
      this.dynamicScreen.forEach((item: any) => {
        if (screenName.toLowerCase().includes(item.key)) {
          this.currentComponentInfo = { ...item };
          this.view = this.appAppHost.viewContainerRef;
          this.view.clear();
          setTimeout(() => {
            this.componentRef = this.view.createComponent(item.component);
            if (this.noOfDirectors)
              this.componentRef.instance.numberOfDirectors = this.noOfDirectors;

            // for mobile number.
            this.componentRef.instance.mobileVerifyInfo = this.mobileVerifyInfo;

            // for personal details.
            if (this.docCustomerDetails) {
              this.componentRef.instance.docCustomerDetails =
                this.docCustomerDetails;
            }
            this.componentRef.instance.isHideField = this.isHideField;
            this.componentRef.instance.basisId = this.basisId;
            this.componentRef.instance.personalDetails = this.personalDetails;

            // for personal doc.
            this.componentRef.instance.personalDoc = this.personalDoc;
            if (this.personalDetails?.length > 0)
              this.componentRef.instance.isMasterSave = true;

            this.componentRef.instance.accountType = 'account';

            this.componentRef.instance.updateParentModel = this.updateAccount;

            this.componentRef.instance?.onCustomSubmit.subscribe(() => {
              if (screenName.toLowerCase().includes('signature')) {
                this.next();
              }
            });

            if (this.componentRef.instance?.onMobileExitEvent)
              this.componentRef.instance?.onMobileExitEvent.subscribe(() => {
                this.router.navigate(['/account/landing']);
              });

            if (this.componentRef.instance?.onBackEvent)
              this.componentRef.instance?.onBackEvent.subscribe(() => {
                this.goBack();
              });
          });
        }
      });
    } else {
      this.view?.clear();
      const dialogRef = this.dialog.open(ErrorNotifierPopupComponent, {
        data: {
          isStageAvilable: false,
          errorMessage: `${screenName} stage is not avilable. Please move to next stage.`,
        },
        width: '750px',
        disableClose: true,
        panelClass: 'popup-dialog-class',
        backdropClass: 'bdrop',
      });
      dialogRef.afterClosed().subscribe(() => {
        this.next();
      });
    }
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.currentUser = result;
        // Load generic data
        this.getGeneric();
        // Get currency code
        this.currencyCode = this.tokenStore.getUserOtherInfo();
        // Get basis ID from route params
        this.basisId = this.route.snapshot.params['id'];
        this.getProductDetails();
        const sessionStep = this.sessionStorageService.getAccountStep();
        if (sessionStep) this.selectedStep = parseInt(sessionStep);

        this.openAccountService
          .getProcessCycle(sessionStep.processCycleCode)
          .subscribe((resp) => {
            this.processDetails = {
              processCycleCode: resp.data.processCycleCode,
              processStageId: resp.data.processStageList[0]?.id,
            };

            this.getScreenDetails(resp);
          });
        this.existingCustomerId =
          this.sessionStorageService.getUserCustomerId();
        //this is for staging customer. we checking 1st staging id avilable, if not then checking existing cust Id.
        const customStageId = this.sessionStorageService.getCustomerStageId();
        const originationId = this.sessionStorageService.getOriginationId();

        if (originationId) {
          this.getOriginationMaster(parseInt(originationId));
        } else if (customStageId) {
          this.getCustomerbyStageId(customStageId);
        } else if (this.existingCustomerId) {
          this.getCustomerById(this.existingCustomerId);
        }
      }
    });

    this.subscriptions.push(loadUserProfileSub);
  }

  getOriginationMaster(originationId: any) {
    this.openAccountService
      .getOriginationMaster(originationId)
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.personalDetails = resp.data[0]?.customerInfo;
          this.originationId = resp.data[0].originationModel.originationId;
          this.originationModel = resp.data[0]?.originationModel;
          this.personalDoc =
            resp.data[0]?.customerInfo[0]?.documnentsInfo?.documents ?? [];
          // this.componentRef.instance.personalDetails = this.personalDetails;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * it will check the updateMasterSave key if its true it will call master-save or else it will move to next screen.
   * @param value inputValue of child screen
   */
  updateAccount = (value: Partial<any> | any) => {
    const sessionData = this.sessionStorageService.getBasisDetails();
    const originationModel = {
      applicationDate: moment(new Date()).format('DD-MMM-YYYY'),
      originationId: this.sessionStorageService.getOriginationId() ?? null,
      accountType: sessionData.accountType,
      basisDetailsId: sessionData.basisDetailsId,
      branchCode: this.currentUser.branchCode,
      source: SOURCE_PAYLOAD_KEY,
      businessProductName: this.productDetails.basisName,
      productDescription: this.productDetails.basisDetailStory,
      currencyCode: this.currencyCode?.currency,
      branchId: this.currentUser.branchId,
      ownership: this.sessionStorageService.getOriginationId(),
      department: this.currentUser?.department,
    };
    if (value.kycDoc) {
      this.kycDoc = value.kycDoc;
      this.docCustomerDetails = value.customerDetails;
    }
    if (value.personalDetails)
      this.personalDetails = value.personalDetails.customer;
    const customerInfo = this.modelFactoryForCustomer(
      this.personalDetails,
      this.kycDoc ?? [],
    );

    if (value?.personalInfo) {
      this.personalDetails = value.personalInfo;
      this.personalDetails.forEach((item: any) => {
        if (item.primaryCustomer) this.personalDoc = item?.documentInfo;
      });
    }
    if (value?.companyDetails) {
      this.getMasterSave({
        originationModel: originationModel,
        corporateCustomer: value?.companyDetails?.corporateCustomer,
      });
      return;
    }
    if (value.updateMasterSave && customerInfo?.length > 0) {
      if (this.ownershipId) {
        this.submitCheckList(value, originationModel, customerInfo);
      } else {
        const FinalOriginationModel = {
          ...originationModel,
          ownership: this.sessionStorageService.getOwnershipId(),
        };
        this.submitCheckList(value, FinalOriginationModel, customerInfo);
      }
    } else this.next();
  };

  submitCheckList(value: any, originationModel: any, customerInfo: any) {
    if (value?.isCheckListDoc) {
      const payload = {
        documentIds: value?.otherLoanDoc,
        originationId: this.originationModel?.originationId,
        screenCode: this.sessionStorageService.getCurrentScreenCode(),
      };
      this.loanApi.saveChecklist(payload).subscribe((resp) => {
        if (resp?.statusCode === 201) {
          this.getMasterSave({
            originationModel: originationModel,
            customerInfo: customerInfo,
          });
        }
      });
    } else
      this.getMasterSave({
        originationModel: originationModel,
        customerInfo: customerInfo,
      });
  }

  /**
   *
   * @param customerInfo is a customerInfo model
   * @param docIds is a document model
   * @returns payload of customerInfo.
   */
  modelFactoryForCustomer(customerInfo: any, docIds: any) {
    const custResp: any = [...customerInfo];
    custResp.forEach((i: any) => {
      custResp[i].documentId = [];
      custResp[0].primaryCustomer = true; //Need to remove lator while multiple customer
      custResp[i].documentId = [docIds[i]];
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
      delete custResp[i].documentsInfoModel;
      delete custResp[i].signatureInfo;
      if (!custResp[i]?.customerStagingId) {
        custResp[i].contact.contactId = null;
        if (custResp[i]?.contact?.address?.[i]?.addressId) {
          custResp[i].contact.address[i].addressId = null;
        }
        delete custResp[i].customerStagingId;
      }
      custResp[0].biometricId = this.sessionStorageService.getBiometricId()
        ? [this.sessionStorageService.getBiometricId()]
        : [];
      custResp[i].isphoneNumVerified = true;
      custResp[i].isEmailVerified = true;
      custResp[i].customerNo = null;
      custResp[i].customerId = null;
      if (this.noOfDirectors)
        custResp[i].corpDirectorModel = {
          sharePercentage: 100 / this.noOfDirectors,
          isManagingDirector: custResp[i]?.primaryCustomer,
        };

      const customerId = this.sessionStorageService.getUserCustomerId();
      if (customerId) {
        delete custResp[i].existingCustomerId;
        custResp[i].customerId = parseInt(customerId);
      } else {
        delete custResp[i].existingCustomerId;
        custResp[i].customerId = null;
      }
    });
    return custResp;
  }

  /**
   * Here api call for master save & updating origination model with originationId.
   * NOTE :- Once Workflow formulla Ready thn conditionally need to add verifyWorkflow api.
   * @param payload
   */
  getMasterSave(payload: any) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode === 200 || resp?.statusCode == 201) {
        this.originationId = resp.data.originationModel.originationId;
        this.sessionStorageService.setOriginationId(
          resp?.data?.originationModel?.originationId,
        );
        if (resp?.data?.customerInfo)
          this.sessionStorageService.setCustomerStagingId(
            resp?.data?.customerInfo?.[0]?.customerStagingId,
          );
        if (resp?.data?.corporateCustomer)
          this.noOfDirectors = resp?.data?.corporateCustomer?.numberOfDirectors;

        this.originationModel = resp.data?.originationModel;
        if (resp?.data?.corporateCustomer)
          this.noOfDirectors = resp?.data?.corporateCustomer?.numberOfDirectors;
        //Note:- properties should be update once complete forumulla list recieves & we ned to call a verify Workflow api,
        //        dynamically wherever it has been asked.
        this.next();
      }
    });
  }

  getCustomerbyStageId(customStageId: any) {
    this.openAccountService
      .getCustByStageId(parseInt(customStageId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.personalDetails = resp.data;
          // if (resp.data[0].primaryCustomer)
          this.personalDoc = resp.data[0].documnentsInfo?.documents ?? [];
        } else if (resp?.statusCode === 204) this.personalDetails = [];
      });
  }

  getGeneric() {
    return new Promise((resolve, reject) => {
      this.sharedService
        .genericValue(this.screenName, Object.keys(this.staticData))
        .subscribe((resp: any) => {
          if (resp?.statusCode === 200) {
            this.ownership = resp.data[OWNERSHIP];
            this.ownershipId = this.ownership.find(
              (r: any) => r?.values.toLowerCase() === 'self',
            )?.id;
            this.sessionStorageService.setOwnershipId(this.ownershipId);
            resolve(this.ownershipId);
          } else {
            reject(new Error('Failed to fetch generic data'));
          }
        });
    });
  }

  getCustomerById(customerId: any) {
    this.openAccountService.getCustomerById(customerId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.personalDetails = resp.data;
      }
    });
  }

  getScreenDetails(resp: any) {
    this.openAccountService
      .getProcessStages(resp.data.processStageList[0].id)
      .subscribe((response) => {
        this.screenList = response.data.screens.sort((s1: any, s2: any) => {
          return s1.sequence - s2.sequence;
        });
        this.sessionStorageService.setCurrentStage(
          resp.data.processStageList[0].id,
        );
        this.factory();
      });
  }

  /**
   * api call for getting product details by basisId
   */
  getProductDetails() {
    this.openAccountService
      .getProductDetails(this.basisId)
      .subscribe((resp) => {
        if (resp?.statusCode === 200 && resp?.data) {
          if (resp?.data.length > 0) {
            this.productDetails = resp.data[0];
            this.screenTitle = resp.data[0].basisName;
            this.mobileVerifyInfo = {
              ...this.mobileVerifyInfo,
              basisName: this.productDetails.basisName,
              individual: resp?.data[0]?.individual,
            };
          }
        }
      });
  }

  factory() {
    this.currentStep = this.screenList?.[this.selectedStep]?.screenName;
    this.showComponent(this.currentStep);
  }

  next() {
    const num = this.selectedStep + 1;
    if (num === this.screenList?.length && num > 0) {
      this.done();
      return;
    } else {
      this.selectedStep = num;
      this.sessionStorageService.setAccountStep(this.selectedStep),
        this.sessionStorageService.setCurrentScreenCode(
          this.screenList?.[num]?.screenCode,
        );
      this.factory();
    }
  }

  getTabDetails(tabDetails: any) {
    const lastStep = this.selectedStep;
    this.selectedStep = tabDetails.selectedIndex;
    this.currentStep = this.screenList[tabDetails.selectedIndex].screenName;
    this.sessionStorageService.setAccountStep(tabDetails.selectedIndex);
    this.sessionStorageService.setCurrentScreenCode(
      this.screenList?.[this.selectedStep]?.screenCode,
    );
    if (lastStep != tabDetails.selectedIndex)
      this.showComponent(this.currentStep);
  }

  onBackOnPreviousStep() {
    this.stepper.previous();
  }

  /**
   * api call for master save in originatin.
   * @param payload
   * @param e
   */
  masterSave(payload: any) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.originationId = resp.data.originationModel.originationId;
        //Note:- properties should be update once complete forumulla list recieves.

        //Note:- Once workflow formula we will get this should be called.
        // this.workFlowVerify(accountPayload, resp, e);

        //Note:- Once workflow formula we will get this should be comment
        this.done();
      }
    });
  }

  /**
   * api call for workflow api.
   * @param accountPayload
   * @param resp
   * @param e
   */
  workFlowVerify(accountPayload: any, e: any) {
    this.loanApi.verifyWorkFlow(accountPayload).subscribe((workres) => {
      if (workres?.autoAction) {
        e.loadingBtnText = LOADING_TEXT;
        e.isLoading = false;
        this.saveCofig(workres);
      } else this.done();
    });
  }

  done() {
    const payload: any = {};
    payload.properties = {};
    payload.screenCode = null;
    payload.processStageId = null;
    payload.processCycleCode = this.processDetails.processCycleCode;
    payload.originationId = this.originationId;
    payload.action = 'Submit';

    this.loanApi.verifyWorkFlow(payload).subscribe((resp) => {
      if (resp?.status === 200) {
        const dialogRef = this.dialog.open(SuccessPopupComponent, {
          data: {
            originationId: this.originationId,
            isComplete: resp?.data?.isComplete,
          },
          width: '750px',
          disableClose: true,
          panelClass: ['popup-dialog-class', 'scroll-card'],
          backdropClass: 'bdrop',
        });
        dialogRef.afterClosed().subscribe((resp) => {
          if (resp === true) {
            this.tokenStore.cleanUpSessionPartially();
            this.router.navigate(['/account/landing']);
          }
        });
      }
    });
  }

  sendMailLink() {
    const email = this.personalDetails[0]?.contact?.email || '';
    const referenceNumber = this.originationModel?.icustRefNo || '';
    const applicantName =
      this.personalDetails[0]?.firstName +
      ' ' +
      this.personalDetails[0]?.lastName;
    const formData: FormData = new FormData();
    formData.append(
      'subject',
      'Thank you for submitting your application through our website.',
    );
    formData.append(
      'body',
      `Dear ${applicantName},\n
Thank you for submitting your application through our website.


We are pleased to inform you that your application has been successfully received and forwarded to the bank.\n
Our team is currently reviewing your information and will get in touch with you shortly to discuss the next steps. \n

Applicant Name: ${applicantName} \n
Reference No: ${referenceNumber} \n

Thank you for choosing us for your financial needs. 
Best regards, `,
    );
    formData.append('to', email);
    this.emailService.triggerTransactionEmail(formData).subscribe();
  }

  goBack() {
    const num = this.selectedStep - 1;
    this.currentStep = this.screenList?.[num]?.screenName;
    setTimeout(() => {
      this.selectedStep = num;
      this.factory();
    }, 200);
  }

  saveCofig(resp: any) {
    const accountBasisDetails = this.sessionStorageService.getBasisDetails();
    const payload = {
      originationId: this.originationId,
      autoAction: resp?.autoAction,
      approvalConfigId: [parseInt(resp?.approval)],
      basisId: accountBasisDetails?.basisDetailsId,
      processCycleCode: accountBasisDetails?.processCycleCode,
      currentStage: this.sessionStorageService.getCurrentStage(),
      targetStage: parseInt(resp?.targetStage),
      currentScreen: parseInt(resp?.screenCode),
      targetScreen: parseInt(resp?.targetScreen),
    };

    this.loanApi.saveLoanApprovalConfig(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.done();
      } else if (resp?.statusCode === 204) this.done();
    });
  }

  verfyStep(verifyStep: any, currentStep: any) {
    if (currentStep?.toLowerCase().includes(verifyStep)) return true;
    else return false;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
