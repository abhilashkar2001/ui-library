import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'app/shared/services/common-service/common.service';

@Component({
  selector: 'app-card-cibil-score',
  templateUrl: './card-cibil-score.component.html',
  styleUrls: ['./card-cibil-score.component.scss'],
})
export class CardCibilScoreComponent implements OnInit {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();
  @Output() isDifferentMobileNumber: EventEmitter<any> = new EventEmitter();

  isDifferentMobile = false;
  showCibilScoreResult = false;
  stepperTitle: string;
  selectedOption: 'different' | 'same' = 'same';

  constructor(
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.stepperTitle = this.activatedRoute.snapshot['queryParams']['title'];
  }

  ngOnInit(): void {}

  onContinue() {
    this.showCibilScoreResult = true;
  }

  onBack() {
    this.backEvent.emit();
  }

  onBackCIBILScoreResult() {
    this.showCibilScoreResult = false;
  }

  radioChange(event: any) {
    this.isDifferentMobile = event.value === 'same' ? false : true;
    this.commonService.isUserUsingDifferentMobile(this.isDifferentMobile);
    const tempRow = [
      { stepName: 'Personal Details' },
      { stepName: 'Select KYC' },
    ];
    this.isDifferentMobile
      ? this.isDifferentMobileNumber.emit({
          steps: tempRow,
          isDifferentMobile: true,
        })
      : this.isDifferentMobileNumber.emit({
          steps: [],
          isDifferentMobile: false,
        });
  }

  onVerify() {
    this.showCibilScoreResult = true;
  }

  onConfirm() {
    this.confirmEvent.emit();
  }
}
