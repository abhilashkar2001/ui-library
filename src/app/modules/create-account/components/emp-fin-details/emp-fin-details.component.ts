import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-emp-fin-details',
  templateUrl: './emp-fin-details.component.html',
  styleUrls: ['./emp-fin-details.component.scss']
})
export class EmpFinDetailsComponent {
  detailsForGeneric: any = {
    accountType: ''
  }
  noOfapplicantguardian: any = 3;
  accordionItems: any = [];
  empFinDetails!: FormGroup

  ngOnInit() {
    let acc = localStorage.getItem('account-type');
    this.detailsForGeneric.accountType = acc !== null ? acc : 'individual';
    this.createAccordian();
  }

  createAccordian(): void {
  const { accountType } = this.detailsForGeneric;
  // Reset accordion items
  this.accordionItems = [];
  // Titles for corporate applicants
  const corporateTitles = ['Srihari', 'Prem (Brother)', 'Priya (Sister)', 'CFO', 'CTO'];
  // Add Minor Details section if account type is 'minor'
  // if (accountType === 'minor') {
  //   this.accordionItems.push({
  //     header: 'Minor Details',
  //     expanded: true,
  //     showIsPrimary: false,
  //     accountType
  //   });
  // }
  // Generate header label based on account type and index
  const getHeaderLabel = (index: number): string => {
    // if (accountType === 'corporate') {
      return corporateTitles[index] || `Corporate Member ${index + 1}`;
    // }
    // const labels:any = {
    //   joint: 'Applicant',
    //   minor: 'Guardians'
    // };
    // return `${labels[accountType] || 'Applicant'} ${index + 1}`;
  };
  // Create accordion items
  for (let i = 0; i < this.noOfapplicantguardian; i++) {
    this.accordionItems.push({
      header: getHeaderLabel(i),
      expanded: false,
      showIsPrimary: true,
      accountType
    });
  }
}

getForm(form:any){
  this.empFinDetails = form;
}



  // deleteAccordian(index: any) {
  //   if (this.accordionItems.length > 1) {
  //     if (index > -1) {
  //       this.accordionItems.splice(index, 1);
  //     }
  //   }
  // }
}
