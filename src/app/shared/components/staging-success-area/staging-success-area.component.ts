import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnDestroy,
} from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { OriginationService } from "app/shared/services/origination.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-staging-success-area",
  templateUrl: "./staging-success-area.component.html",
  styleUrls: ["./staging-success-area.component.scss"],
})
export class StagingSuccessAreaComponent implements OnInit, OnDestroy {
  @Input() originationId: any;
  @Input() isComplete: any;
  updatedResult: any[] = [];
  interval: any;
  private destroy$ = new Subject<void>();

  constructor(
    private originationSVC: OriginationService,
    private cdr: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.matIconRegistry.addSvgIcon(
      "approveIcon",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/approve-icon.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "rejectIcon",
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/reject-icon.svg"
      )
    );
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);

    if (changes?.isComplete.currentValue == true) {
      this.fetchDetails();
    }
  }

  fetchDetails() {
    this.originationSVC
      .getCompletedtages(this.originationId)
      .pipe(takeUntil(this.destroy$)) 
      .subscribe((res: any) => {
        if (res?.data) {
          this.updatedResult = res?.data;
          let i = res?.data.findIndex((e) => e.moduleStatus == "COMPLETED");
          if (i >= 0) return;

          this.interval = setTimeout(() => {
            this.fetchDetails();
          }, 1000);
          this.cdr.markForCheck();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.interval) {
      clearTimeout(this.interval);
    }
  }
}
