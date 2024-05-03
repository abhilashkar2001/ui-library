import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bill-section-c-values',
  templateUrl: './bill-section-c-values.component.html',
  styleUrls: ['./bill-section-c-values.component.scss']
})
export class BillSectionCValuesComponent implements OnInit {
  billSectionCFrom:FormGroup
  constructor( private fb:FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(){
    this.billSectionCFrom=this.fb.group({
      invoiceNo:[],
      invoiceDate:[],
      currency:[],
      code:[],
      export:[],
      charge:[],
      commission:[],
      deduction:[],
      realisable:[],
      place:[],
      name:[],
      designation:[],
      commenttoBank:[]
    })
  }
}
