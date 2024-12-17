import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit {
  @Input() applicationInfo: any = [];

  constructor() {}

  ngOnInit(): void {}
}
