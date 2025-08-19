import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import {
  ComponentStagesConstant,
  ComponentStagesMap,
} from 'app/config/component.constant';
import { ComponentLRUCache } from 'app/modules/loan/stages/component-lru-cache';
import { RenderComponentService } from 'app/shared/services/render-component.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-cheque-book-stages',
  templateUrl: './cheque-book-stages.component.html',
  styleUrls: ['./cheque-book-stages.component.scss'],
})
// export class ChequeBookStagesComponent {

// }
export class ChequeBookStagesComponent implements OnInit {
  @ViewChildren('container', { read: ViewContainerRef })
  container!: QueryList<ViewContainerRef>;
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;
  readonly activePanels = signal<Set<number>>(new Set());
  readonly isAnyPanelOpen = computed(() => this.activePanels().size > 0);
  protected componentMapping: Map<string, Record<string, any>> = new Map<
    string,
    Record<string, any>
  >();
  private readonly componentCache = new ComponentLRUCache(6);
  // private processCycleCode: string | undefined;
  // private basisId = 52;
  // private productDetails: IProduct | undefined;
  currentStepIndex = 1;
  private componentRefs = new Map<number, ComponentRef<any>>();
  allowedPanelIndex = 0;
  completedSteps = new Set<number>();
  category: string | null;

  constructor(
    private renderComponentService: RenderComponentService,
    // private loanService: LoanService,
    private cdr: ChangeDetectorRef,
    private sessionStorageSerive: SessionStorageService,
  ) {
    this.category = this.sessionStorageSerive.getItem('basisClass');
  }

  ngOnInit() {
    console.log(this.category);

    setTimeout(() => {
      this.panels.get(0)?.open();
    });
    this.fetchScreens();
  }

  /**
   * On Opening of panel it will load the cache component ref if already loaded earlier
   * or else it will load the component from the given screen code for that panel
   * Component will be fetched from the component mapping and will be loaded in ComponentLoadingService
   * @param index
   * @param screenCode
   */
  onPanelOpened<K extends keyof ComponentStagesMap>(
    index: number,
    screenName: K,
    screenCodeNum?: number,
  ) {
    const currentSet = new Set(this.activePanels());
    if (!currentSet.has(index)) {
      currentSet.add(index);
      this.activePanels.set(currentSet);
      const container = this.container.get(index);
      if (container && !this.componentCache.get(index)) {
        const component = ComponentStagesConstant[screenName];
        const componentRef = this.renderComponentService.loadComponent<
          ComponentStagesMap[K]
        >(container, component);
        if ('screenCode' in componentRef.instance) {
          (componentRef.instance as any).screenCode = screenCodeNum;
        }

        if (screenName && 'screenName' in componentRef.instance) {
          (componentRef.instance as any).screenName = screenName;
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
        this.completedSteps.add(index);
        this.openNextPanel(index);
      } else {
        this.openNextPanel(index);
      }
    }
  }

  openNextPanel(currentIndex: number) {
    const nextIndex = currentIndex + 1;
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
  // fetchProductDetails() {
  //   this.loanService.getProductDetails(this.basisId).subscribe((resp) => {
  //     if (resp?.statusCode === 200 && resp?.data?.length > 0) {
  //       this.productDetails = resp?.data[0];
  //       if (!this.productDetails) return;
  //       this.basisId = this.productDetails['id'];
  //       this.processCycleCode = this.productDetails['processCycleCode'];
  //       this.fetchProcessStages();
  //     }
  //   });
  // }

  /**
   * This will fetch all the process stages from the give process cycle code
   * Only first stage will be taken as there is only once stage to be mantained
   * for website customer portal
   * Using this fetched process stage id all the screens will be fetched
   */
  // fetchProcessStages() {
  //   this.loanService
  //     .fetchProcessStages(this.processCycleCode!)
  //     .subscribe((res) => {
  //       if (res?.statusCode === 200 && res?.data?.processStageList.length > 0) {
  //         const data = res?.data?.processStageList[0];
  //         if (data && data.id) {
  //           this.sessionStorageSerive.setCurrentStage(data.id);
  //           this.fetchScreens(data.id);
  //         }
  //       }
  //     });
  // }

  /**
   * This method will fetch all the screens based of the process stage id
   * All the screens to be filled by the customer to proceed with loan application
   * @param processStageId of the selected product
   */
  fetchScreens() {
    // this.loanService.fetchScreens(processStageId).subscribe((resp) => {
    //   if (resp?.statusCode === 200 && resp?.data?.screens) {
    const screens =
      this.category !== 'CORPORATE ACCOUNT'
        ? [
            {
              screenCode: 464,
              screenName: 'Verify Mobile Number',
              route: null,
              fileUrl: null,
              sequence: 1,
              screenValue: 'W1VEMN',
            },
            {
              screenCode: 456,
              screenName: 'Personal Identification',
              route: null,
              fileUrl: null,
              sequence: 2,
              screenValue: 'W1DOCU',
            },
            {
              screenCode: 461,
              screenName: 'Personal Details',
              route: null,
              fileUrl: null,
              sequence: 4,
              screenValue: 'W1SIGN',
            },
            {
              screenCode: 462,
              screenName: 'Account Detail',
              route: null,
              fileUrl: null,
              sequence: 5,
              screenValue: 'W1SUM',
            },
            {
              screenCode: 463,
              screenName: 'Cheque Book Details',
              route: null,
              fileUrl: null,
              sequence: 3,
              screenValue: 'W1TECO',
            },
            {
              screenCode: 497,
              screenName: 'Terms & Conditions',
              route: null,
              fileUrl: null,
              sequence: 9,
              screenValue: 'W1CODE',
            },
            {
              screenCode: 464,
              screenName: 'Document Upload',
              route: null,
              fileUrl: null,
              sequence: 6,
              screenValue: 'W1VEMN',
            },
            {
              screenCode: 497,
              screenName: 'Summary',
              route: null,
              fileUrl: null,
              sequence: 7,
              screenValue: 'W1CODE',
            },
            {
              screenCode: 498,
              screenName: 'Digital Signature',
              route: null,
              fileUrl: null,
              sequence: 8,
              screenValue: 'W1BUDE',
            },
            {
              screenCode: 498,
              screenName: 'Payment Details',
              route: null,
              fileUrl: null,
              sequence: 9,
              screenValue: 'W1BUDE',
            },
            {
              screenCode: 498,
              screenName: 'Bussiness Details',
              route: null,
              fileUrl: null,
              sequence: 10,
              screenValue: 'W1BUDE',
            },
          ]
        : [
            {
              screenCode: 456,
              screenName: 'Account Details',
              route: null,
              fileUrl: null,
              sequence: 2,
              screenValue: 'W1DOCU',
            },
            {
              screenCode: 461,
              screenName: 'Personal Identification',
              route: null,
              fileUrl: null,
              sequence: 3,
              screenValue: 'W1SIGN',
            },
            {
              screenCode: 462,
              screenName: 'Personal Details',
              route: null,
              fileUrl: null,
              sequence: 4,
              screenValue: 'W1SUM',
            },
            {
              screenCode: 463,
              screenName: 'Document Upload',
              route: null,
              fileUrl: null,
              sequence: 5,
              screenValue: 'W1TECO',
            },
            {
              screenCode: 463,
              screenName: 'Employment & Financial Details',
              route: null,
              fileUrl: null,
              sequence: 6,
              screenValue: 'W1TECO',
            },
            {
              screenCode: 497,
              screenName: 'Summary',
              route: null,
              fileUrl: null,
              sequence: 7,
              screenValue: 'W1CODE',
            },
            {
              screenCode: 498,
              screenName: 'Digital Signature',
              route: null,
              fileUrl: null,
              sequence: 8,
              screenValue: 'W1BUDE',
            },
            {
              screenCode: 464,
              screenName: 'Verify Mobile Number',
              route: null,
              fileUrl: null,
              sequence: 1,
              screenValue: 'W1VEMN',
            },
            {
              screenCode: 498,
              screenName: 'Payment Details',
              route: null,
              fileUrl: null,
              sequence: 9,
              screenValue: 'W1BUDE',
            },

            {
              screenCode: 498,
              screenName: 'Bussiness Details',
              route: null,
              fileUrl: null,
              sequence: 10,
              screenValue: 'W1BUDE',
            },
            
          ];
    const i = screens.findIndex((s) => s.sequence === 1);
    if (i > -1) screens.splice(i, 1);
    screens
      .sort((a, b) => a.sequence - b.sequence)
      .forEach((screen) => {
        this.componentMapping.set(screen.screenName, screen);
      });
    this.cdr.markForCheck();

    setTimeout(() => {
      this.allowedPanelIndex = 0;
      this.panels.get(0)?.open();
    });
  }
  // });
  // }
}
