import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
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
  async calculateAmortize(principal, rateOfInterest, years, months, days) {
    let obj: any;
    await this.calculateTenure(years, months, days, "Month").then(
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
            EMI
          ),
        ];

        // calculating total payable amount.
        this.totalPayableAmount = Math.ceil(EMI * val.finalTenure);
        console.log(this.totalPayableAmount);

        obj = {
          monthlyInterestArr: this.monthlyInterestArr,
          emiAmount: EMI,
          totalPayableAmount: this.totalPayableAmount,
        };
      }
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
  calculatePrincipalInterestMonthly(p, r, t, EMI) {
    // for 1st month record
    const interestComponent = p * r;
    let monthlyInterestArr = [];
    monthlyInterestArr.push({
      interestComponent: interestComponent,
      principalComponent: EMI - interestComponent,
      emiAmmount: EMI,
      osLoan: p,
    });

    //for next remaning months record
    for (let i = 0; i < t - 1; i++) {
      let osLoan =
        monthlyInterestArr[i].osLoan - monthlyInterestArr[i].principalComponent;
      let obj = {
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
  calculateEMI(P, R, n) {
    var EMI = (P * R * Math.pow(1 + R, n)) / (Math.pow(1 + R, n) - 1);
    console.log(EMI);
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
    principal,
    rateOfInterest,
    years,
    months,
    days,
    tenureType = "Month" //this should be dynamic , later on will add.
  ) {
    console.log(principal, rateOfInterest, years, months, days, "jdkdsj");
    let finalInterest: any;
    await this.calculateTenure(years, months, days, tenureType).then(
      (val: any) => {
        console.log(val);
        const interest = this.calculateCompoundInterest(
          principal,
          rateOfInterest,
          val.finalTenure,
          val.NoOf
        );
        finalInterest = interest.toFixed(2).split(".");
      }
    );

    // setTimeout(() => {
    //   return finalInterest[0] + finalInterest[1].slice(0, 3);
    // }, 200);
    return {
      interestPayble: parseFloat(
        finalInterest[0] + "." + finalInterest[1].slice(0, 3)
      ),
      totalPayableAmmount:
        parseFloat(finalInterest[0] + "." + finalInterest[1].slice(0, 3)) +
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
  calculateTenure(years, months, days, tenureType) {
    return new Promise((resolve, reject) => {
      const totalMonths = years * 12 + months;
      const daysInMonth = days ? Math.ceil(days / 30) : 0;
      console.log(daysInMonth, days, totalMonths, ".........");
      const totalMonthsIncludingDays = totalMonths + daysInMonth;
      console.log(totalMonthsIncludingDays);
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
  getFinalTenure(tenureType, tenure, noOfDay?) {
    let n = 0;
    switch (tenureType) {
      case "Half Year":
        n = 2;
        break;
      case "Quarter":
        n = 4;
        break;
      case "Month":
        return { finalTenure: tenure, NoOf: 12 };
        break;
      case "Daily":
        n = noOfDay;
        break;
      default:
        n = tenure;
    }
    // return { finalTenure: tenure, NoOf: n };
  }

  /**
   *
   * @param principal
   * @param rateOfInterest
   * @param tenure
   */
  calculateCompoundInterest(principal, rateOfInterest, tenure, NoOf) {
    rateOfInterest = rateOfInterest / (NoOf * 100);
    console.log(rateOfInterest);
    return principal * Math.pow(1 + rateOfInterest, tenure) - principal;
  }
}
