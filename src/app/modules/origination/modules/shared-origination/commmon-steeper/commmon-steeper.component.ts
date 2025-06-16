import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-commmon-steeper',
  templateUrl: './commmon-steeper.component.html',
  styleUrls: ['./commmon-steeper.component.scss'],
})
export class CommmonSteeperComponent implements OnChanges {
  @Input() screenList: any;
  @Input() screenTitle: any;
  @Input() screenIndex = 0;
  @Input() customClass = '';
  isLinear = true;
  @ViewChild('stepper') myStepper: MatStepper | any;
  @Output() customSelectionChange = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes.screenIndex) {
      this.screenIndex = changes?.screenIndex?.currentValue;
      setTimeout(() => {
        this.next();
      }, 200);
    } else {
      this.screenList = changes?.screenList?.currentValue;
      this.screenList = this.screenList?.map((obj: any) => ({
        ...obj,
        completed: false,
        isEditable: false,
      }));
      setTimeout(() => {
        this.next();
      }, 200);
    }
  }
  next() {
    if (this.screenList?.length > 0) {
      for (let i = 0; i < this.screenIndex; i++) {
        this.screenList[i].completed = true;
        this.screenList[i].isEditable = true;
      }
      this.myStepper['_selectedIndex'] = this.screenIndex;
    }
    // const el = document.querySelector(".mat-step-label-selected");
    // if (el) el.scrollIntoView();
  }
  stepperSelectionChange(event: any) {
    this.customSelectionChange.emit(event);
  }
}
