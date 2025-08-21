import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SignPadComponent } from 'app/modules/origination/modules/origination-external-callback/digital-sign/sign-pad/sign-pad.component';

@Component({
  selector: 'app-signature-popup',
  templateUrl: './signature-popup.component.html',
  styleUrls: ['./signature-popup.component.scss'],
})
export class SignaturePopupComponent {
  @ViewChild('signPadRef', { static: false })
  signPadComponent!: SignPadComponent;

  file: File | null = null;
  fileName = '';
  signImg = false;
  fileUploadFailed = false;

  constructor(private dialogRef: MatDialogRef<SignaturePopupComponent>) {}

  // E-sign via sign pad (blob from canvas)
  signpadImage(blob: Blob) {
    const file = new File([blob], 'E-sign.png', { type: 'image/png' });
    this.handleUploadEvent(file, true);
  }

  // Drag and drop
  onFileDropped(file: File) {
    this.file = file;
    this.fileName = file.name;
    this.signImg = true;
    this.handleUploadEvent(file);
  }

  // Manual file selection
  onFileSelect(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.file = file;
    this.fileName = file.name;

    this.handleUploadEvent(file);
  }

  // Convert File to base64 and close dialog with result
  handleUploadEvent(file: File, isESign?: boolean | undefined) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;

      this.dialogRef.close({
        result: base64String, // base64 string returned to parent
        title: 'Signature',
        isESign,
      });
    };

    reader.onerror = (err) => {
      console.error('File read error:', err);
      this.fileUploadFailed = true;
    };

    reader.readAsDataURL(file);
  }

  saveDigitalSign() {
    if (this.signPadComponent) {
      this.signPadComponent.saveSignature(); // emits signpadImage event
    }
  }
}
