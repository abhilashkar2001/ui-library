import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  OnInit,
  QueryList,
  signal,
  Type,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { RenderComponentService } from '../../../shared/services/render-component.service';
import { LoanService } from '../../../shared/services/loan/loan.service';
import { IProduct, TokenStorageService } from '@onerumango/utils';
import {
  ComponentCardConstant,
  ComponentMap,
} from '../../../config/component.constant';
import { MatExpansionPanel } from '@angular/material/expansion';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { LoanFlowConstants } from 'app/modules/origination/modules/loans/pages/loan-flow/loan-flow.constant';
import { Router } from '@angular/router';
import { SuccessModalPopupComponent } from 'app/shared/components/success-modal-popup/success-modal-popup.component';
import { ComponentLRUCache } from 'app/modules/loan/stages/component-lru-cache';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StagesComponent implements OnInit {
  @ViewChildren('container', { read: ViewContainerRef })
  container!: QueryList<ViewContainerRef>;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  readonly activePanels = signal<Set<number>>(new Set());
  readonly isAnyPanelOpen = computed(() => this.activePanels().size > 0);
  protected componentMapping: Map<string, Record<string, any>> = new Map<
    string,
    Record<string, any>
  >();
  private readonly componentCache = new ComponentLRUCache(10);
  private processCycleCode: string | undefined;
  private basisId: number | undefined;
  public productDetails: IProduct | undefined;
  currentStepIndex = 1;
  private componentRefs = new Map<number, ComponentRef<any>>();
  allowedPanelIndex = 0;
  completedSteps = signal<Set<number>>(new Set<number>());
  customHeader = LoanFlowConstants.CUSTOM_HEADER;
  processDetails: any;
  email: any;
  progressMapping: Map<string, Record<string, any>> = new Map();

  constructor(
    private renderComponentService: RenderComponentService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
    private sessionStorageSerive: SessionStorageService,
    private tokenStorageService: TokenStorageService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.basisId = this.sessionStorageSerive.getItem('basisId');
    setTimeout(() => {
      this.panels.get(0)?.open();
    });
    this.fetchProductDetails();
  }

  /**
   * On Opening of panel it will load the cache component ref if already loaded earlier
   * or else it will load the component from the given screen code for that panel
   * Component will be fetched from the component mapping and will be loaded in ComponentLoadingService
   * @param index
   * @param screenCode
   */
  onPanelOpened<K extends keyof ComponentMap>(
    index: number,
    screenCode: K,
    screenName?: string,
    screenCodeNum?: number,
  ) {
    const currentSet = new Set(this.activePanels());
    if (!currentSet.has(index)) {
      currentSet.add(index);
      this.activePanels.set(currentSet);
      const container = this.container.get(index);
      if (container && !this.componentCache.get(index)) {
        const component = ComponentCardConstant[
          screenCode as keyof typeof ComponentCardConstant
        ] as Type<any>;
        const componentRef = this.renderComponentService.loadComponent(
          container,
          component,
        );

        componentRef.setInput('screenCode', screenCodeNum);
        if (screenName) {
          componentRef.setInput('screenName', screenName);
        }

        this.componentCache.set(index, componentRef);
        this.componentRefs.set(index, componentRef);
      }
    }
  }

  async saveComponent(index: number) {
    const componentRef = this.componentRefs.get(index);
    if (!componentRef) return;
    const instance = componentRef.instance as any;
    if (instance.submitForm) {
      const result = await instance.submitForm();
      if (result === 'success') {
        this.completedSteps.update((set) => {
          const newSet = new Set(set);
          newSet.add(index);
          return newSet;
        });
        this.cdr.markForCheck();
        if (index === this.componentMapping.size - 1) {
          this.onFlowDone();
        } else {
          this.openNextPanel(index);
        }
      }
    }
  }

  openNextPanel(currentIndex: number) {
    const nextIndex = currentIndex + 1;
    this.allowedPanelIndex = nextIndex;
    const nextPanel = this.panels.get(nextIndex);
    if (nextPanel) {
      nextPanel.open();
    }
  }

  // Edit Component Functionality
  editComponent(index: number) {
    const componentRef = this.componentRefs.get(index);
    if (componentRef) {
      (componentRef.instance as any).isEdit = true;
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  isEditing(i: number): boolean {
    return !!this.componentRefs.get(i)?.instance?.isEdit;
  }

  // When the user click back then close the current panel and move to before panel
  goBack(index: number): void {
    if (index === 0) {
      this.router.navigate([`loan/login`]);
    }

    const currentPanel = this.panels.get(index);
    currentPanel?.close();
    this.activePanels.mutate((set) => set.delete(index));

    const prevIndex = index - 1;
    const prevPanel = this.panels.get(prevIndex);
    prevPanel?.open();

    this.allowedPanelIndex = prevIndex;
    this.cdr.markForCheck();
  }

  /**
   * Once panel is closed the remove that panel from the active panel list
   * If want to clear the container for that particular panel it can be cleaned here
   * If want to destory the component ref on closing of panel you can clean here
   * @param index of the panel
   */
  onPanelClosed(index: number) {
    const currentSet = new Set(this.activePanels());
    if (currentSet.has(index)) {
      currentSet.delete(index);
      this.activePanels.set(currentSet);

      const container = this.container.get(index);
      if (container) {
        container.clear();
        // this.componentRefs.delete(index);
      }
    }
  }

  /**
   * Fetch the details of the selected product
   * This will fetch all details of the selected product from origination basis Maintenance
   * We will get product id  process cycle code and other details using which the accessibility
   * to the customer will be given
   */
  fetchProductDetails() {
    if (!this.basisId) {
      return;
    }
    this.loanService.getProductDetails(this.basisId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.length > 0) {
        this.productDetails = resp?.data[0];
        if (!this.productDetails) return;

        this.basisId = this.productDetails['id'];
        this.processCycleCode = this.productDetails['processCycleCode'];
        this.fetchProcessStages();
      }
    });
  }

  /**
   * This will fetch all the process stages from the give process cycle code
   * Only first stage will be taken as there is only once stage to be mantained
   * for website customer portal
   * Using this fetched process stage id all the screens will be fetched
   */
  fetchProcessStages() {
    this.loanService
      .fetchProcessStages(this.processCycleCode!)
      .subscribe((res) => {
        if (res?.statusCode === 200 && res?.data?.processStageList.length > 0) {
          const data = res?.data?.processStageList[0];
          if (data && data.id) {
            this.processDetails = {
              id: res?.data?.id,
              processCycleCode: res?.data?.processCycleCode,
              processStageId: res?.data?.processStageList[0]?.id,
            };
            this.sessionStorageSerive.setCurrentStage(data.id);
            this.fetchScreens(data.id);
          }
        }
      });
  }

  /**
   * This method will fetch all the screens based on the process stage id
   * All the screens to be filled by the customer to proceed with loan application
   * @param processStageId of the selected product
   */
  fetchScreens(processStageId: number) {
    this.loanService.fetchScreens(processStageId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.screens) {
        const screens = resp.data.screens;

        const fullScreens = [...screens].sort(
          (a, b) => a.sequence - b.sequence,
        );
        this.progressMapping = new Map(
          fullScreens.map((s) => [s.screenValue, s]),
        );

        const filteredScreens = screens.filter((s) => s.sequence !== 1);
        filteredScreens
          .sort((a, b) => a.sequence - b.sequence)
          .forEach((screen) => {
            this.componentMapping.set(screen.screenValue, screen);
          });

        this.cdr.markForCheck();
        setTimeout(() => {
          this.allowedPanelIndex = 0;
          this.panels.get(0)?.open();
        });

        this.cdr.detectChanges();
      }
    });
  }

  onFlowDone() {
    const originationId = this.sessionStorageSerive.getOriginationId();
    if (originationId) {
      this.fetchPersonalDetails(originationId);
    }
    const payload: any = {};
    payload.properties = {};
    payload.screenCode = null;
    payload.processStageId = null;
    payload.processCycleId = this.processDetails?.id;
    payload.originationId = originationId;
    payload.action = 'Submit';
    payload.transactionType = 'CORP_LOAN';
    this.loanService.verifyWorkFlow(payload).subscribe((resp: any) => {
      if (resp?.status === 200) {
        const dialogRef = this.dialog.open(SuccessModalPopupComponent, {
          data: {
            applicationNo: originationId,
            msg: resp?.data?.isComplete
              ? 'Application is approved successfully'
              : 'Application is submitted successfully',
            note: 'Please quote the above reference number in all communications with the bank and We will review and get back to you.',
            email: this.email ?? 'shiyam.ram@rumango.com',
            type: 'loan',
            isComplete: resp?.data?.isComplete,
            cifApplicationNo: resp?.data?.cifApplicationNo,
            kycRefNo: resp?.data?.kycRefNo,
            cbsReferenceNo: resp?.data?.cbsReferenceNo,
          },
          width: '45%',
          height: 'auto',
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

  // To get the customer email calling this method
  fetchPersonalDetails(originationId: number) {
    if (originationId)
      this.loanService
        .getPersonalDetailsData(originationId)
        .subscribe((res) => {
          if (res.data.customerInfo.length > 0) {
            this.email = res.data.customerInfo[0]?.contact?.email;
          }
        });
  }
}
