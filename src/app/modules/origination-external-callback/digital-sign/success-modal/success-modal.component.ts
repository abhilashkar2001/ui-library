import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-success-modal',
  templateUrl: './success-modal.component.html',
  styleUrls: ['./success-modal.component.scss'],
})
export class SuccessModalComponent implements OnInit {
  screenType: string | any;
  constructor(@Inject(MAT_DIALOG_DATA) public screenData: any) {}

  ngOnInit(): void {
    this.screenType = this.screenData.screenType;
  }
}
