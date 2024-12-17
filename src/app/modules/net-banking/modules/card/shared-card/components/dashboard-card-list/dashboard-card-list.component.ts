import { Component, Input, OnInit } from '@angular/core';
import { Cards } from 'app/shared/models/card.model';

@Component({
  selector: 'app-dashboard-card-list',
  templateUrl: './dashboard-card-list.component.html',
  styleUrls: ['./dashboard-card-list.component.scss'],
})
export class DashboardCardListComponent implements OnInit {
  @Input() title: string | any;
  @Input() cardList: Cards | any;

  constructor() {}

  ngOnInit(): void {}
}
