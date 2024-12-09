import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-ic-action-button",
  templateUrl: "./ic-action-button.component.html",
  styleUrls: ["./ic-action-button.component.scss"]
})
export class IcActionButtonComponent implements OnInit {
  @Input() buttonName: string | any;
  @Input() buttonType: string | any;
  @Input() disabled: boolean | any;
  @Input("matIcon") matIcon: string | any;
  @Input("iconSrc") iconSrc: string | any;

  @Output() onClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  clickHandler(event: any) {
    event.preventDefault();
    this.onClick.emit();
  }
}
