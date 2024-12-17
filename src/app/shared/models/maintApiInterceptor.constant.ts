export class InterceptorConstant {
  static readonly MAINTENANCE_CONSTANT = [
    {
      name: 'country',
      endPoint: '/country?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'branch',
      endPoint: '/branch?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'entity',
      endPoint: 'entity?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'currency',
      endPoint: '/icCurrency?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'pincode',
      endPoint: '/city/fetchByPinCode?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'role',
      endPoint: '/ic-role?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'profile',
      endPoint: '/loginApi/profile',
    },
    {
      name: 'privilege',
      endPoint: '/auth/privilege',
    },
    {
      name: 'parentScreen',
      endPoint:
        '/loginApi/allParentScreen?authStatus=AUTHORIZED&recordStatus=OPEN',
    },
    {
      name: 'allRole',
      endPoint: '/loginApi/allRole',
    },
    {
      name: 'processCycle',
      endPoint: '/process_cycle?authStatus=AUTHORIZED&recordStatus=OPEN',
    },
    {
      name: 'bank',
      endPoint: '/bank?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'OperatingBranch',
      endPoint: '/ic-user/getOperatingBranch',
    },
    {
      name: 'securityPolicy',
      endPoint: '/securityPolicy/summary',
    },
    {
      name: 'screenName',
      endPoint: '/screen/summary?',
    },
    {
      name: 'tellerProduct',
      endPoint: '/teller-product?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'checkList',
      endPoint: '/ChecklistMaint?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'instrumentMaint',
      endPoint: '/instrumentMaint?authStatus=AUTHORIZED&recordStatus=OPEN',
    },
    {
      name: 'basisClass',
      endPoint: '/basis-class?businessSuite=',
    },
    {
      name: 'affinityProgram',
      endPoint: '/affinity-program?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'featureTitle',
      endPoint: '/featureTitle?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'interestChargeMapping',
      endPoint: '/interestChargeMapping?oneTimeAuth=Y&recordStatus=OPEN',
    },
    {
      name: 'state',
      endPoint: '/state?countryId',
    },
    {
      name: 'generic',
      endPoint: '/generic-value?screenName',
    },
    {
      name: 'webBasisClass',
      endPoint: '/basis-class/fetchAllWebsiteProduct?',
    },
    {
      name: 'webBasisSubClass',
      endPoint: '/details/fetchSubClass?basisClass',
    },
  ];
}
