import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { OriginationService } from "app/shared/services/origination.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-staging-success-area",
  templateUrl: "./staging-success-area.component.html",
  styleUrls: ["./staging-success-area.component.scss"],
})
export class StagingSuccessAreaComponent implements OnInit {
  @Input() originationId: any;
  @Input() isComplete: any;
  updatedResult: any[] = [];
  interval: any;
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

  async fetchDetails() {
    const res: any = await this.originationSVC
      .getCompletedtages(this.originationId)
      .toPromise();

    if (res?.data) {
      this.updatedResult = res?.data;
      let i = res?.data.findIndex((e) => e.moduleStatus == "COMPLETED");
      if (i >= 0) return;
      setTimeout(() => {
        this.fetchDetails();
      }, 1000);
      this.cdr.markForCheck();
    }
  }
}
