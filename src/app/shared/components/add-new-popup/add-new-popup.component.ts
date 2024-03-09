import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-popup',
  templateUrl: './add-new-popup.component.html',
  styleUrls: ['./add-new-popup.component.scss']
})
export class AddNewPopupComponent implements OnInit {
  checkToggle: boolean = false;
  constructor(private dialogRef: MatDialogRef<AddNewPopupComponent>,) { }

  ngOnInit(): void {
  }
  customerToggle(event) {
    this.checkToggle = event;
  }
  onSubmit() {
    this.dialogRef.close();
  }

  onBack() {
    this.dialogRef.close();
  }
}
