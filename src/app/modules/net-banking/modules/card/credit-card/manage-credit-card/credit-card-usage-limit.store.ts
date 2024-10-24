export class LimitType {
    static readonly Limits = [
      {
        header: "ATM Withdrawal",
        control: "atmWithdraw",
        toggleControl:"atmRequired",
        min:"minAtmAmount",
        max:"minAtmAmount",
      },
      {
        header: "Online Transaction",
        control: "onlineTransaction",
        toggleControl:"onlineRequired",
        min:"minOnlineAmount",
        max:"maxOnlineAmount",
      },
      {
        header: "Merchant Outlets",
        control: "merchantOutlets",
        toggleControl:"merchantRequired",
        min:"minMerchantAmount",
        max:"maxMerchantAmount",
      },
      {
        header: "Tap & Pay Transaction",
        control: "tapPayTransaction",
        toggleControl:"tapRequired",
        min:"minTapRequired",
        max:"maxTapRequired",
  
      },
    ];
  }
  