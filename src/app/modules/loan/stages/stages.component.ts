import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  OnInit,
  QueryList,
  signal,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { RenderComponentService } from '../../../shared/services/render-component.service';
import { LoanService } from '../../../shared/services/loan/loan.service';
import { ComponentLRUCache } from './component-lru-cache';
import { IProduct } from '@onerumango/utils';
import { ComponentConstant } from '../../../config/component.constant';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StagesComponent implements OnInit {
  @ViewChildren('container', { read: ViewContainerRef })
  container!: QueryList<ViewContainerRef>;
  readonly activePanels = signal<Set<number>>(new Set());
  readonly isAnyPanelOpen = computed(() => this.activePanels().size > 0);
  protected componentMapping: Map<string, Record<string, any>> = new Map<
    string,
    Record<string, any>
  >();
  private readonly componentCache = new ComponentLRUCache(3);
  private processCycleCode: string | undefined;
  private basisId: number = 132767;
  private productDetails: IProduct | undefined;

  constructor(
    private renderComponentService: RenderComponentService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchProductDetails();
  }

  /**
   * On Opening of panel it will load the cache component ref if already loaded earlier
   * or else it will load the component from the given screen code for that panel
   * Component will be fetched from the component mapping and will be loaded in ComponentLoadingService
   * @param index
   * @param screenCode
   */
  onPanelOpened(index: number, screenCode: string) {
    const currentSet = new Set(this.activePanels());
    if (!currentSet.has(index)) {
      currentSet.add(index);
      this.activePanels.set(currentSet);
      const container = this.container.get(index);
      if (container && !this.componentCache.get(index)) {
        const component =
          ComponentConstant[screenCode as keyof typeof ComponentConstant];
        if (component) {
          const componentRef = this.renderComponentService.loadComponent(
            container,
            component,
          );
          this.componentCache.set(index, componentRef);
        }
      }
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
          if (data?.id) this.fetchScreens(data?.id);
        }
      });
  }

  /**
   * This method will fetch all the screens based of the process stage id
   * All the screens to be filled by the customer to proceed with loan application
   * @param processStageId of the selected product
   */
  fetchScreens(processStageId: number) {
    this.loanService.fetchScreens(processStageId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.screens) {
        const screens = resp.data.screens;
        const i = screens.findIndex((s) => s.sequence === 1);
        if (i > -1) screens.splice(i, 1);
        screens
          .sort((a, b) => a.sequence - b.sequence)
          .forEach((screen) => {
            this.componentMapping.set(screen.screenValue, screen);
          });
        this.cdr.markForCheck();
      }
    });
  }
}
