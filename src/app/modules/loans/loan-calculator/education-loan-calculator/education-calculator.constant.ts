export class EducationLoan {
  static readonly COURSE_DURATION = {
    minDuration: 6,
    maxDuration: 72
  };
  static readonly TUTION_FEES = {
    minTutionFee: 5000,
    maxTutionFee: 100000
  };
  static readonly REQUIRED_LOAN = {
    minLoan: 5000,
    maxLoan: 100000
  };
  static readonly EDUCATION_STEEPER: any = [
    {
      name: "Expense Details",
      imageUrl: "assets/images/education.svg",
      fxFlexPercentage: 33,
      isCompleted: true
    },
    {
      name: "EMI Ammount",
      imageUrl: "assets/images/education_emi.svg",
      fxFlexPercentage: 33,
      isCompleted: false
    },
    {
      name: "Tax Benefits",
      imageUrl: "assets/images/education_tax.svg",
      fxFlexPercentage: 17,
      isCompleted: false
    }
  ];
}
