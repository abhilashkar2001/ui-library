import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-net-banking-home",
  templateUrl: "./net-banking-home.component.html",
  styleUrls: ["./net-banking-home.component.scss"],
})
export class NetBankingHomeComponent implements OnInit {
  genericScreenName: any = "Pending for approval";
  columns = [
    {
      columnDef: "version",
      header: "Version",
      cell: (element: any) => `${element?.version}`,
    },
    {
      columnDef: "lastUpdatedBy",
      header: "Action By",
      cell: (element: any) => `${element.lastUpdatedBy}`,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
