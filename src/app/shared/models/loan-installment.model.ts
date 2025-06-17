export interface LoanInstallmentModel {
  interestRate: number;
  totalAmtDue: number;
  installmentDate: string;
  customerId: number;
  maturityDate: string;
  loanAmount: number;
  outstandPrincpl: number;
  duration: number;
  remainingInstall: number;
  emiAmount: number;
  arrear: number;
  status: string;
  sanctionAmount: number;
  email: string;
  loanType: string;
  customerName: string;
  bankCode: string;
  originationId: string;
  totalInterest: number;
  components: Component[];
}

export interface Component {
  componentName: string;
  currentdue: number;
  overDues: number;
  principleAmt: number;
  duedate?: string;
}
