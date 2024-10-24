import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
