import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ic-action-button',
  templateUrl: './ic-action-button.component.html',
  styleUrls: ['./ic-action-button.component.scss'],
})
export class IcActionButtonComponent {
  @Input() buttonName: string | any;
  @Input() buttonType: string | any;
  @Input() disabled: boolean | any;
  @Input() matIcon: string | any;
  @Input() iconSrc: string | any;

  @Output() inClick = new EventEmitter<any>();

  clickHandler(event: any) {
    event.preventDefault();
    this.inClick.emit();
  }
}
