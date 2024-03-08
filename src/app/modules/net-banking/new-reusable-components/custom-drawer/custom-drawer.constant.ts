export class DrawerConstant {
  static readonly DRAWER_MENU = [
    {
      name: "Transaction",
      path: "",
      roleName: "parent-node",
      children: [
        {
          name: "BG Issuance",
          path: "",
          roleName: "child-node",
          children: [
            { name: "BG Issuance", path: "" },
            { name: "BG Amendment", path: "" },
            { name: "BG Physical Amedment", path: "" },
          ],
        },
        { name: "LETTER OF CREDIT", path: "", roleName: "child-node" },
        { name: "REMITTANCE", path: "", roleName: "child-node" },
        { name: "BILLS PROCESSING", path: "", roleName: "child-node" },
        { name: "EXPORTS PROCESSING", path: "", roleName: "child-node" },
        { name: "BUYERS CREDIT", path: "", roleName: "child-node" },
        { name: "EXPORT BILL DISPATCH", path: "", roleName: "child-node" },
        { name: "EXPORT S/W BILL LODGEMENT", path: "", roleName: "child-node" },
        { name: "EEFC", path: "", roleName: "child-node" },
      ],
    },
    {
      name: "Beneficiary Maintenance",
      path: "beneficiary",
      roleName: "parent-node",
    },
  ];
}
