import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-top-performing',
  templateUrl: './top-performing.component.html',
  styleUrls: ['./top-performing.component.scss']
})
export class TopPerformingComponent implements OnInit {
  panelOpenState: boolean = false;
  closeOthers: boolean = false;

  constructor() {

  }

  ngOnInit(): void {

  }

}
