import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-card-personal-details',
  templateUrl: './card-personal-details.component.html',
  styleUrls: ['./card-personal-details.component.scss'],
})
export class CardPersonalDetailsComponent {
  @Output() backEvent: EventEmitter<any> = new EventEmitter();
  @Output() confirmEvent: EventEmitter<any> = new EventEmitter();

  stepperTitle: any;

  onConfirm() {
    this.confirmEvent.emit();
  }

  onBack() {
    this.backEvent.emit();
  }
}
