import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { BulkUpload } from "app/shared/services/bulk-upload/bulk-upload-service";

@Component({
  selector: "app-upload-bulk-upload",
  templateUrl: "./upload-bulk-upload.component.html",
  styleUrls: ["./upload-bulk-upload.component.scss"],
})
export class UploadBulkUploadComponent implements OnInit {
  @Input() screenName: string;
  maintTemplateUpload: FormGroup;
  fileFormat: string[] = ["Excel"];
  file: any;
  screenList: any;
  uploadData: any;
  uploadKey: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bulkservice: BulkUpload
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params: any) => {
      this.uploadData = params?.params?.data;
    });
    this.buildMaintTemplateForm();
    this.fetchAllScreens();
  }
  goBack() {
    this.router.navigate(["/user/dashboard/bulk-upload"]);
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
  }

  buildMaintTemplateForm() {
    this.maintTemplateUpload = this.fb.group({
      productType: [""],
      dateOfBirth: [""],
      uplodedFileArray: this.fb.array([]),
    });
    this.maintTemplateUpload.valueChanges.subscribe((res) => {});
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
    this.router.navigate(["/maintenance/dashboard/maintenanceUpload"]);
    const formData = new FormData();
    formData.append("file", this.file);
    this.bulkservice.uploadExcel(formData).subscribe((res) => {});
  }

  downloadTemplate(event: Event) {
    event.stopPropagation();
    this.bulkservice
      .downloadTemplate(this.maintTemplateUpload.value.selectMaintenance)
      .subscribe((res: any) => {
        this.saveFile(res);
      });
  }

  private saveFile(response: any): void {
    const blob = new Blob([response.body], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.maintTemplateUpload.value.selectMaintenance}_excel_file.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
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
