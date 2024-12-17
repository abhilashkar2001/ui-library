import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-ic-radio-button',
  templateUrl: './ic-radio-button.component.html',
  styleUrls: ['./ic-radio-button.component.scss'],
})
export class IcRadioButtonComponent implements OnInit {
  @Input() control: AbstractControl | any;
  @Input() optiions: any[] | any;
  @Input() labelClass: string | any;
  @Input() displayLabel: string | any;
  @Input() layout: any = 'row';
  @Input() radiolayout: any = 'row';
  @Input() gap: string | number = 10;

  @Output() change = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onChaage(e: any) {
    console.log(e);
  }
}
