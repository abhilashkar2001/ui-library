import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-sign-summary',
  templateUrl: './sign-summary.component.html',
  styleUrls: ['./sign-summary.component.scss'],
})
export class SignSummaryComponent implements OnInit {
  imageUrl: any;
  @Output() nextEnable = new EventEmitter();
  signatureId: any;
  @Input() updateParentModel:
    | ((
        part: Partial<any>,
        isFormValid: boolean,
        isFormDirty?: boolean,
      ) => void)
    | undefined;
  @Input() markAsTouched: boolean | undefined;

  title: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef2: MatDialogRef<SignSummaryComponent>,
    private sanitizer: DomSanitizer,
  ) {
    this.imageUrl = environment.microServiceURL + data?.imageUrl;
  }
  ngOnInit(): void {
    this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.imageUrl,
    );
  }
  editPage() {
    this.dialogRef2.close('edited');
  }

  close() {
    this.dialog.closeAll();
  }
}
