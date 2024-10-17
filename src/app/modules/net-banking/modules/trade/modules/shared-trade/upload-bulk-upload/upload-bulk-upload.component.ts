import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AllInOnePopupComponent } from "app/shared/components/all-in-one-popup/all-in-one-popup.component";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { ViewExcelDocComponent } from "app/shared/components/view-excel-doc/view-excel-doc.component";
import { BulkUpload } from "app/shared/services/bulk-upload/bulk-upload-service";
import { CommonService } from "app/shared/services/common-service/common.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as XLSX from "xlsx";

type AOA = any[][];
@Component({
  selector: "app-upload-bulk-upload",
  templateUrl: "./upload-bulk-upload.component.html",
  styleUrls: ["./upload-bulk-upload.component.scss"],
})
export class UploadBulkUploadComponent implements OnInit {
  @Input("updateParentModel") updateParentModel: (
    part: Partial<any>,
    isFormValid: boolean
  ) => void;

  @Input("screenName") screenName: any = "";
  @Input() showNewBeneficiary: boolean = false;
  @Input() showProductType: boolean = true;
  @Input() isHideFilter: boolean = false;
  @Input() isHideButton: boolean = false;

  @Output() customSaveBulkUpload = new EventEmitter<any>();
  @Output() downloadBulkUpload = new EventEmitter<any>();
  maintTemplateUpload: FormGroup;
  fileFormat: string[] = ["Excel"];
  file: any;
  screenList: any;
  uploadData: any;
  uploadKey: any;
  currentUser: any;
  otp: any;
  currentDate = new Date();
  tableHeader: any[];
  tableBody: any[];
  data: AOA = [
    [1, 2],
    [3, 4],
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bulkservice: BulkUpload,
    private dialog: MatDialog,
    private commonService: CommonService,
    private tokenStorage: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
    this.route.queryParamMap.subscribe((params: any) => {
      this.uploadData = params?.params?.data;
    });
    this.buildMaintTemplateForm();
    this.fetchAllScreens();
  }

  goBack() {
    this.router.navigate(["/user/dashboard/fund-transfer/bulk-upload"]);
  }
  droppedFiles(evt) {
    this.file = evt.target?.files[0];
    this.uploadFileArrlrngth.push(this.addfiles(evt));
  }
  Onfilechange(evt) {
    this.file = evt.target.files[0];

    let filesObject: any = {
      files: evt.target.files[0],
      name: evt.target.files[0].name,
    };
    this.uploadFileArrlrngth.push(this.addfiles(filesObject));

    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error("Cannot use multiple files");
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: "binary" });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
      this.convertExcel(this.data);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  convertExcel(data) {
    const [keys, ...values] = data;
    const obj = values.map((array) =>
      array.reduce((a, v, i) => ({ ...a, [keys[i]]: v }), {})
    );
    this.tableHeader = keys;
    this.tableBody = obj;
  }

  viewExcel() {
    this.dialog.open(ViewExcelDocComponent, {
      width: "80%",
      disableClose: true,
      data: {
        tableHeader: this.tableHeader,
        tableBody: this.tableBody,
        fileName: this.file.name,
      },
    });
  }

  buildMaintTemplateForm() {
    this.maintTemplateUpload = this.fb.group({
      productType: [""],
      beneficiary: [""],
      processingDate: [this.currentDate],
      uplodedFileArray: this.fb.array([]),
    });
    this.maintTemplateUpload.valueChanges.subscribe((res) => {
      const uploadedDocs = {
        ...res.uplodedFileArray,
      };
      this.updateParentModel(
        {
          uploadedDocs: uploadedDocs,
        },
        uploadedDocs?.uplodedFileArray?.length > 0 ? true : false
      );
    });
  }

  get uploadFileArrlrngth() {
    return this.maintTemplateUpload.get("uplodedFileArray") as FormArray;
  }

  addfiles(filesData?): FormGroup {
    return this.fb.group({
      files: filesData.files,
      name: filesData.name,
    });
  }

  removeItem(index: number) {
    this.uploadFileArrlrngth.removeAt(index);
  }
  goToScreen() {
    const formData = new FormData();
    formData.append("fileName", this.file);
    const userName = this.currentUser.userName;
    const productType = this.maintTemplateUpload.value.productType;
    const processingDate = this.maintTemplateUpload.value.processingDate;
    const screenName = this.screenName;
    this.customSaveBulkUpload.emit({
      formData,
      userName,
      productType,
      processingDate,
    });
    // this emit should be remove after trade api intigeration done
  }

  downloadTemplate(event: Event) {
    event.stopPropagation();
    this.downloadBulkUpload.emit("");
  }

  fetchAllScreens() {
    // this.maintenanceUploadService.fetchAllScreen().subscribe((res) => {
    //   this.sortByAlphabetically(res);
    //   if (this.uploadData) {
    //     this.maintTemplateUpload
    //       .get("selectMaintenance")
    //       .setValue(this.uploadData);
    //   }
    // });
  }

  sortByAlphabetically(screens: any) {
    screens &&
      screens.sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
    this.screenList = screens;
  }
}
