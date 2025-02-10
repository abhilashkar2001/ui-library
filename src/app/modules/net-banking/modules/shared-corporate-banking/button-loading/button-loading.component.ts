import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-loading',
  templateUrl: './button-loading.component.html',
  styleUrls: ['./button-loading.component.scss'],
})
export class ButtonLoadingComponent {
  @Input() loading = false;
  @Input() disable = false;
  @Input() btnClass = '';
  @Input() loadingText = 'Please wait';
  @Input() type: 'button' | 'submit' = 'submit';
}
