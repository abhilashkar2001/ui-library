import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-card-personal-details",
  templateUrl: "./card-personal-details.component.html",
  styleUrls: ["./card-personal-details.component.scss"],
})
export class CardPersonalDetailsComponent implements OnInit {
  @Output() onBackEvent: EventEmitter<any> = new EventEmitter();
  @Output() onConfirmEvent: EventEmitter<any> = new EventEmitter();

  stepperTitle: any;

  constructor(private openAccountService: OpenAccountService) {}

  ngOnInit(): void {}

  onConfirm(event: any) {
    this.onConfirmEvent.emit();
  }

  onBack() {
    this.onBackEvent.emit();
  }
}
