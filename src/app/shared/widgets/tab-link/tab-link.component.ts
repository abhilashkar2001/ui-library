import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tabs, TabModel } from 'app/shared/models/tab-model';

@Component({
  selector: 'app-tab-link',
  templateUrl: './tab-link.component.html',
  styleUrls: ['./tab-link.component.scss']
})
export class TabLinkComponent implements OnInit {
  @Input() tabs: Tabs;
  @Output() changeTab: EventEmitter<TabModel> = new EventEmitter<TabModel>();
  selectedTab: TabModel;

  constructor() {
    console.log(this.tabs);
  }

  ngOnInit(): void {
    console.log("calling");
    if (this.tabs.length > 0) this.selectedTab = this.tabs[0];
  }

  navigate(item) {
    this.selectedTab = item;
    this.changeTab.emit(item);
  }
}
