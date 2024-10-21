import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-ic-action-button",
  templateUrl: "./ic-action-button.component.html",
  styleUrls: ["./ic-action-button.component.scss"]
})
export class IcActionButtonComponent implements OnInit {
  @Input() buttonName: string;
  @Input() buttonType: string;
  @Input() disabled: boolean;
  @Input("matIcon") matIcon: string;
  @Input("iconSrc") iconSrc: string;

  @Output() onClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  clickHandler(event) {
    event.preventDefault();
    this.onClick.emit();
  }
}
