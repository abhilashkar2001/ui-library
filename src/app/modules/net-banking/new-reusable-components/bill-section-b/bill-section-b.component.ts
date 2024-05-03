import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bill-section-b',
  templateUrl: './bill-section-b.component.html',
  styleUrls: ['./bill-section-b.component.scss']
})
export class BillSectionBComponent implements OnInit {
  billSectionBForm: FormGroup
  customerCodesList=[
    {label:"123",value:"123"},
    {label:"234",value:"234"},
    {label:"345",value:"345"}

  ]
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(){
    this.billSectionBForm=this.fb.group({
      dateFrom:[],
      dateTo:[],
      softexNo:[],
      dealerBranch:[],
      address1:[],
      address2:[],
      country:[],
      pincode:[],
      state:[],
      city:[],
      realization:[],
      dealerCode:[],
      internalProjectCode:[],
      internalProjectDate:[],
      typeofExported:[]
    })
  }
}
