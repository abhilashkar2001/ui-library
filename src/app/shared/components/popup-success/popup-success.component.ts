import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-popup-success',
  templateUrl: './popup-success.component.html',
  styleUrls: ['./popup-success.component.scss']
})
export class PopupSuccessComponent implements OnInit {
  successOnlyReq:boolean = false;

  constructor( private dialogRef: MatDialogRef<PopupSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    console.log(this.data);
    
    if (this.data.status === "SuccessOnly") {
      this.successOnlyReq = true;
    }
  }
  close(data?) {
    this.dialogRef.close(data);
  }

}
