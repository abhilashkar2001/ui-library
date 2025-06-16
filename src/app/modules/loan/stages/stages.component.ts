import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
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
export class StagesComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;
  containerRef: ComponentRef<LoanDetailsComponent> | undefined;
  readonly panelOpenState = signal(false);
  private processCycleCode: string | undefined;
  constructor(
    private renderComponentService: RenderComponentService,
    private loanService: LoanService,
  ) {}

  ngAfterViewInit(): void {
    this.renderComponent();
  }

  fetchProcessStages() {
    this.loanService
      .fetchProcessStages(this.processCycleCode!)
      .subscribe((res) => {
        this.processCycleCode = res;
      });
  }

  renderComponent() {
    this.containerRef = this.renderComponentService.loadComponent(
      this.container,
      LoanDetailsComponent,
    );
  }
}
