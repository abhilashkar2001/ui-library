import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  OnInit,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { RenderComponentService } from '../../../shared/services/render-component.service';
import { LoanDetailsComponent } from '../components/loan-details/loan-details.component';
import { LoanService } from '../../../shared/services/loan/loan.service';

@Component({
  selector: 'app-stages',
  templateUrl: './stages.component.html',
  styleUrls: ['./stages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StagesComponent implements OnInit, AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  containerRef: ComponentRef<LoanDetailsComponent> | undefined;
  readonly panelOpenState = signal(false);
  private processCycleCode: string | undefined;
  private basisId: number = 132767;
  protected componentMapping: Map<string, Record<string, any>> = new Map<
    string,
    Record<string, any>
  >();

  constructor(
    private renderComponentService: RenderComponentService,
    private loanService: LoanService,
  ) {}

  ngOnInit() {
    this.fetchProductDetails();
  }

  ngAfterViewInit(): void {
    this.renderComponent();
  }

  renderComponent() {
    this.containerRef = this.renderComponentService.loadComponent(
      this.container,
      LoanDetailsComponent,
    );
  }

  fetchProductDetails() {
    this.loanService.getProductDetails(this.basisId).subscribe((resp) => {
      if (resp?.statusCode === 200 && resp?.data?.length > 0) {
        const data = resp?.data[0];
        if (!data) return;
        this.basisId = data['id'];
        this.processCycleCode = data['processCycleCode'];
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
        resp?.data?.screens.forEach((screen) => {
          this.componentMapping.set(screen.screenValue, screen);
        });
      }
    });
  }

  protected readonly Array = Array;
}
