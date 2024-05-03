import { Component, OnInit } from '@angular/core';
import { SalaryAccountService } from './salary-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-salary-account',
  templateUrl: './salary-account.component.html',
  styleUrls: ['./salary-account.component.scss']
})
export class SalaryAccountComponent implements OnInit {
  columns:any=[
    {
      columnDef: "corporateId",
      header: "Corporate Id",  
      cell: (element: any) => element.corporateId,
    },
    {
      columnDef: "empNo",
      header: "Employee Number",  
      cell: (element: any) => element.empNo,
    },
    {
      columnDef: "lastName",
      header: "Name ",  
      cell: (element: any) => element.lastName,
    },
  ]
  salaryData: Object;
  constructor(private api:SalaryAccountService,private route: Router) { }

  ngOnInit(): void {
    this.getSummary()
  }
  getSummary(){
    this.api.getSummary('1234').subscribe(resp=>{
      console.log(resp);
      this.salaryData=resp;
    })
  }
  customEditForm(){
    this.route.navigate(["user/dashboard/add-salary"]);
  }

}
