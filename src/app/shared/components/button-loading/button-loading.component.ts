import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'button-loading',
  templateUrl: './button-loading.component.html',
  styleUrls: ['./button-loading.component.scss'],
})
export class ButtonLoadingComponent implements OnInit {
  @Input() loading = false;
  @Input() disable = false;
  @Input() btnClass = '';
  @Input() loadingText = 'Please wait';
  @Input() type: 'button' | 'submit' = 'submit';

  constructor() {}

  ngOnInit() {}
}
