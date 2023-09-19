import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatStepper } from "@angular/material/stepper";

@Component({
  selector: "app-commmon-steeper",
  templateUrl: "./commmon-steeper.component.html",
  styleUrls: ["./commmon-steeper.component.scss"],
})
export class CommmonSteeperComponent implements OnChanges, OnInit {
  @Input() screenList;
  @Input() screenIndex = 0;
  isLinear = true;
  @ViewChild("stepper") myStepper: MatStepper;
  @Output() customSelectionChange = new EventEmitter<any>();
  selectStep = 0;
  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.screenIndex) {
      this.screenIndex = changes?.screenIndex?.currentValue;
      console.log(changes.screenIndex);

      setTimeout(() => {
        this.next();
      }, 200);
    } else {
      this.screenList = changes.screenList.currentValue;
      this.screenList = this.screenList?.map((obj) => ({
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
        // this.myStepper.next();
      }
      this.myStepper["_selectedIndex"] = this.screenIndex;
    }
    // this.selectStep = 1;

    // var num = this.screenIndex + 1;
    // this.myStepper.selectedIndex = num;
    //this.myStepper.next();
  }
  stepperSelectionChange(event) {
    console.log(event);
    this.customSelectionChange.emit(event);
  }
}
