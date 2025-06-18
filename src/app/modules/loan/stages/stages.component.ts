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
  private readonly componentCache = new ComponentLRUCache(3);
  private processCycleCode: string | undefined;
  private basisId: number = 132767;
  private productDetails: IProduct | undefined;
  protected componentMapping: Map<string, Record<string, any>> = new Map<
    string,
    Record<string, any>
  >();

  readonly activePanels = signal<Set<number>>(new Set());
  readonly isAnyPanelOpen = computed(() => this.activePanels().size > 0);

  constructor(
    private renderComponentService: RenderComponentService,
    private loanService: LoanService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.fetchProductDetails();
  }

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
            ComponentConstant[screenCode as keyof typeof ComponentConstant],
          );
          this.componentCache.set(index, componentRef);
        }
      }
    }
  }

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

  fetchScreens(processStageId: number) {
    this.loanService.fetchScreens(processStageId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.screens) {
        resp?.data?.screens
          ?.sort((a, b) => a.sequence - b.sequence)
          .forEach((screen) => {
            this.componentMapping.set(screen.screenValue, screen);
          });
        this.cdr.markForCheck();
      }
    });
  }
}
