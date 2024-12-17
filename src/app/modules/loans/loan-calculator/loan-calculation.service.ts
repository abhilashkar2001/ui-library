import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoanCalulationService {
  totalPayableAmount: any = 0;
  monthlyInterestArr: any[] = [];
  constructor() {}

  /**
   * This is Amortize method to calculate loan EMI, interestpayble, monthly Calculation, total payble
   * @param principal
   * @param rateOfInterest
   * @param years
   * @param months
   * @param days
   * @returns all above data in array of list
   *
   *
   */
  async calculateAmortize(
    principal: any,
    rateOfInterest: any,
    years: any,
    months: any,
    days: any,
  ) {
    let obj: any;
    await this.calculateTenure(years, months, days, 'Month').then(
      (val: any) => {
        // calculation for emi
        const ratePerMonth = rateOfInterest / (12 * 100);
        const EMI = this.calculateEMI(principal, ratePerMonth, val.finalTenure);

        //calculating emi, interest, osLoan, principal monthWise
        this.monthlyInterestArr = [
          ...this.calculatePrincipalInterestMonthly(
            principal,
            ratePerMonth,
            val.finalTenure,
            EMI,
          ),
        ];

        // calculating total payable amount.
        this.totalPayableAmount = Math.ceil(EMI * val.finalTenure);

        obj = {
          monthlyInterestArr: this.monthlyInterestArr,
          emiAmount: EMI,
          totalPayableAmount: this.totalPayableAmount,
        };
      },
    );
    return obj;
  }

  /**
   * calculating month wise loan interest record.
   * @param p = principal
   * @param r =interest rate by month
   * @param t =tenure in months
   * @param EMI =emi amount
   * @returns month wise record
   */
  calculatePrincipalInterestMonthly(p: any, r: any, t: any, EMI: any) {
    // for 1st month record
    const interestComponent = p * r;
    const monthlyInterestArr = [];
    monthlyInterestArr.push({
      interestComponent: interestComponent,
      principalComponent: EMI - interestComponent,
      emiAmmount: EMI,
      osLoan: p,
    });

    //for next remaning months record
    for (let i = 0; i < t - 1; i++) {
      const osLoan =
        monthlyInterestArr[i].osLoan - monthlyInterestArr[i].principalComponent;
      const obj: any = {
        interestComponent: osLoan * r,
        principalComponent: EMI - osLoan * r,
        emiAmmount: EMI,
        osLoan: osLoan,
      };
      monthlyInterestArr.push(obj);
    }

    return monthlyInterestArr;
  }

  /**
   *
   * @param P =principal
   * @param R = rate of interest by month
   * @param n = tenure by month
   * @returns emi amount
   */
  calculateEMI(P: any, R: any, n: any) {
    const EMI = (P * R * Math.pow(1 + R, n)) / (Math.pow(1 + R, n) - 1);
    return EMI;
  }

  /**
   * Method name: Compound interest.
   * @param principal
   * @param rateOfInterest
   * @param years
   * @param months
   * @param days
   * @param tenureType
   * @returns
   */
  async getInterestPayable(
    principal: any,
    rateOfInterest: any,
    years: any,
    months: any,
    days: any,
    tenureType = 'Month', //this should be dynamic , later on will add.
  ) {
    let finalInterest: any;
    await this.calculateTenure(years, months, days, tenureType).then(
      (val: any) => {
        const interest = this.calculateCompoundInterest(
          principal,
          rateOfInterest,
          val.finalTenure,
          val.NoOf,
        );
        finalInterest = interest.toFixed(2).split('.');
      },
    );

    // setTimeout(() => {
    //   return finalInterest[0] + finalInterest[1].slice(0, 3);
    // }, 200);
    return {
      interestPayble: parseFloat(
        finalInterest[0] + '.' + finalInterest[1].slice(0, 3),
      ),
      totalPayableAmmount:
        parseFloat(finalInterest[0] + '.' + finalInterest[1].slice(0, 3)) +
        principal,
    };
  }

  /**
   *
   * @param years
   * @param months
   * @param days
   * @param tenureType
   * @returns total months - totalMonthsIncludingDays.
   */
  calculateTenure(years: any, months: any, days: any, tenureType: any) {
    return new Promise((resolve) => {
      const totalMonths = years * 12 + months;
      const daysInMonth = days ? Math.ceil(days / 30) : 0;
      const totalMonthsIncludingDays = totalMonths + daysInMonth;
      resolve(this.getFinalTenure(tenureType, totalMonthsIncludingDays));
    });
  }

  /**
   * Note: currently only for months doing
   *
   * @param tenureType
   * @param tenure
   * @param noOfDay
   * @returns
   */
  getFinalTenure(tenureType: any, tenure: any, noOfDay?: any) {
    let n: any = 0;
    switch (tenureType) {
      case 'Half Year':
        n = 2;
        break;
      case 'Quarter':
        n = 4;
        break;
      case 'Month':
        return { finalTenure: tenure, NoOf: 12 };
      case 'Daily':
        n = noOfDay;
        break;
      default:
        n = tenure;
    }
    return { finalTenure: tenure, NoOf: n }; // Include `n` here
  }

  /**
   *
   * @param principal
   * @param rateOfInterest
   * @param tenure
   */
  calculateCompoundInterest(
    principal: any,
    rateOfInterest: any,
    tenure: any,
    NoOf: any,
  ) {
    rateOfInterest = rateOfInterest / (NoOf * 100);
    return principal * Math.pow(1 + rateOfInterest, tenure) - principal;
  }
}
