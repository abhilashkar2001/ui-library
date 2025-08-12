import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-parent-company',
  templateUrl: './parent-company.component.html',
  styleUrls: ['./parent-company.component.scss'],
})
export class ParentCompanyComponent {
  parentControl = new FormControl('');
  @Output() selectCompany = new EventEmitter<any>();
  savedData = new EventEmitter<any>();

  parentResults = [
    { name: 'Zynapse group', icon: 'assets/images/parent-icon.svg' },
    { name: 'Alpha Corp', icon: 'assets/images/parent-icon.svg' },
    { name: 'Beta Industries', icon: 'assets/images/parent-icon.svg' },
    { name: 'Delta Enterprises', icon: 'assets/images/parent-icon.svg' },
    { name: 'Omega Ltd', icon: 'assets/images/parent-icon.svg' },
  ];
  showResults = false;

  constructor() {}

  ngOnInIt() {}
  fetch() {
    this.showResults = true;
    this.parentResults;
  }

  onCompanySelect(company: any) {
    this.savedData.emit(company);
    console.log(company);
  }
}
