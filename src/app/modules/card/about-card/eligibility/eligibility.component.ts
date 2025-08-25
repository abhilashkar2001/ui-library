import { Component } from '@angular/core';

@Component({
  selector: 'app-eligibility',
  templateUrl: './eligibility.component.html',
  styleUrls: ['./eligibility.component.scss'],
})
export class EligibilityComponent {
  eligibilityData: any = {
    description:
      'Review the comprehensive eligibility requirements to ensure you qualify for our premium credit card. Meeting all criteria ensures faster application processing and approval.',
    basicRequirements: [
      'Age: 21 to 65 years for primary cardholders',
      'Age: 18+ years for add-on cardholders',
      'Indian resident with valid address proof',
      'Stable employment or business for minimum 2 years',
      'No history of loan defaults or bankruptcy',
    ],
  };
}
