import { Location } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cibil-score-poor-dialg',
  templateUrl: './cibil-score-poor-dialg.component.html',
  styleUrls: ['./cibil-score-poor-dialg.component.scss']
})
export class CibilScorePoorDialgComponent implements OnInit {

  header: any;
  applicationNo: any;
  @Output() submitClicked = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<any>();
  constructor(
    private dialogRef: MatDialogRef<CibilScorePoorDialgComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.applicationNo = this.data?.applicationNo;
  }

  close() {
    this.dialogRef.close();
  }

  done() {
    this.router.navigate(['/cards']);
    this.close();
  }

  onBack() {
    this.close();
    this.location.back();
  }

}
