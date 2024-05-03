import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: './beneficiary-details.component.html',
  styleUrls: ['./beneficiary-details.component.scss']
})
export class BeneficiaryDetailsComponent implements OnInit {

  public static Bg_Issuance: any[] = [
    {
      title: "Applicant's Info",
      value: "BG Issuance",
    },
    {
      title: "BG Info",
      value: "BG Issuance",
    },
    {
      title: "Other Info",
      value: "BG Issuance",
    },
    {
      title: "Attachemnts",
      value: "BG Issuance",
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
