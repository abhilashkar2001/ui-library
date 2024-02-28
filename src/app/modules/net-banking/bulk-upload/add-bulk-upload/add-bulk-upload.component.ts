import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BulkUploadConstant } from "./bulk.upload.constant";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-add-bulk-upload",
  templateUrl: "./add-bulk-upload.component.html",
  styleUrls: ["./add-bulk-upload.component.scss"],
})
export class AddBulkUploadComponent implements OnInit {
  public approvalForm: FormGroup;
  isEdit = false;

  approvalList = [
    {
      level: "Level 0",
      user: "Abhilash",
      status: "Approved",
      id: 3444,
      remark: "eiowniuwe oe c ewh wo w",
    },
    {
      level: "Level 1",
      user: "Abhilash",
      status: "Approved",
      id: 330,
      remark: "dkln  nwnewncineic ei cw",
    },
    {
      level: "Level 2",
      user: "Abhilash",
      status: "Rejected",
      id: 399,
      remark: "dkldnds jsd dskj s ds sjsd sd sd sd ds ",
    },
  ];

  columns = BulkUploadConstant.GENERIC_COLUMNS;
  staticData = {
    data: BulkUploadConstant.staticData,
    meta: {
      page: 1,
      size: 5,
      totalElements: 562,
      totalPages: 113,
    },
    statusCode: 200,
    status: "OK",
  };
  auditLogObject = {
    kioskId: 319857,
    kioskSystemCode: "12347",
    kioskSystemName: "Raghul",
    passcode: "$2a$10$c08JOwq1GujQoKp1XF5Ybuwsete1VVULGqZLA.wzJkTsLLhEahxpy",
    logoutCode: "$2a$10$UCTj/AjY5X4AA2k9bLyl5OdaMAloO.O5bWrty6uPEMpeQo00rbCra",
    kioskSystemEnable: true,
    entityCode: "SN1",
    bankCode: "HSB",
    branchCode: "HS1",
    branchName: "HSB",
    bankName: "hsb",
    kioskStatus: null,
    countryCode: "INR",
    countryTelIsdCode: 91,
    mobileLength: 10,
    oneTimeAuth: "Y",
    recordStatus: "OPEN",
    authStatus: "UNAUTHORIZED",
    created: "2024-02-26 17:45:07",
    createdBy: "PREMCREATOR",
    authBy: null,
    authorizedDate: null,
    lastUpdated: "2024-02-28 10:31:03",
    empId: null,
    lastUpdatedBy: "PREMAPP",
    version: 3,
    contact: [
      {
        contactId: 328182,
        telephone: null,
        mobile: "8778588300",
        mobtCode: "",
        email: null,
        whatsappNo: null,
        waptCode: null,
        alternativeNumber: null,
        altCode: null,
        fax: null,
        residencePhone: null,
        officePhone: null,
        address: [],
      },
    ],
    email: null,
    mobileNo: "8778588300",
    mobtCode: "",
  };
  Id: any;
  // BulkUploadConstant.staticData;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isEdit = true;
    this.Id = this.route.snapshot.params["id"];
  }
}
