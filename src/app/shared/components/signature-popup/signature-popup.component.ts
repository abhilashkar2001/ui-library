import { Component } from '@angular/core';

@Component({
  selector: 'app-signature-popup',
  templateUrl: './signature-popup.component.html',
  styleUrls: ['./signature-popup.component.scss'],
})
export class SignaturePopupComponent {
  currentIndex = 1;
  tabs = [
    { sequence: 1, label: 'E-Sign' },
    { sequence: 2, label: 'Upload' },
  ];
  file: any;

  signpadImage(event: any) {
    this.file = new File([event], 'E-sign.png', {
      type: 'png',
    });
  }
}
