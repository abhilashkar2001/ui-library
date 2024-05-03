import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders-info',
  templateUrl: './orders-info.component.html',
  styleUrls: ['./orders-info.component.scss']
})
export class OrdersInfoComponent implements OnInit {
  public orders:any[] = [
    {
   
      title: "ORDER NO 1",
      type: "Remittamce_Applicant_Info",
    },
    {
   
      title: "ORDER NO 2",
      type: "Remittamce_Applicant_Info",
    },
   
  ]
  constructor() { }

  ngOnInit(): void {
  }

}
