import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { environment } from 'environments/environment';
const MICROSERVICE_URL = environment.microServiceURL;

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {
  attachementInfoForm: FormGroup
  titles: any[] = ["BG Text", "Contract Copy", "Declaration", "Approvals", "Others"];
  fileNamelength: number;
  showUplodad: boolean = false;

  slectedFiles: File[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.buildAttachmentInfoForm();
    this.addTitleCategory();
  }


  /**Buildform*/
  buildAttachmentInfoForm(data?: any) {
    this.attachementInfoForm = this.formBuilder.group({
      titleCategory: this.formBuilder.array([]),
    });
  }

  public get titleCategory(): FormArray {
    return this.attachementInfoForm?.get("titleCategory") as FormArray;
  }


  //customerArray
  createDocArray(data?) {
    return this.formBuilder.group({
      titleId: [
        data ? data.titleId : "",
        ,
      ],
      titledesc: [
        data ? data.titledesc : "",
        ,
      ],
      fileUplodedArray: this.formBuilder.array([]),
      id: [data?.id ?? null],
    });
  }

  /**Getting Controle Of fileUploded Array */
  addTitleCategory(data?: any) {
    this.titleCategory.push(this.createDocArray(data));
    // Initialize file length as 0 for each iteration
    this.fileNamelength = 0;
  }

  /**Remove the titlecategory */
  removeTitleCategoty(index: number) {
    this.titleCategory.removeAt(index);
  }


  public getArray(i) {
    return this.titleCategory.controls[i].get(
      "fileUplodedArray"
    ) as FormArray;
  }


  fileName(event, index) {
    this.showUplodad = true;
    this.slectedFiles = event.target.files;
    // const file: File = event.target.files[0];
    Array.from(event?.target?.files).forEach((file: File) => {
      console.log('Uploading file:', file.name);
      this.uploadDocument(file, index);
    });
  }

  uploadDocument(file, index) {
    let lengthForPAyload;
    let formData = new FormData();
    let data = {
      documentName: "Others Document",
      documentType: "",
      documentNumber: "",
      documentSide: index,
      fileName: file.name,
      fileType: file.type,
      verificationType: "Attachments",
    };
    formData.append("data", JSON.stringify(data));
    formData.append("file", file);
    formData.append("module", "document");
    this.commonService.uploadDocument(formData).subscribe((res) => {
      if (res.type === HttpEventType.UploadProgress) {
      } else if (res instanceof HttpResponse) {
        let responseBody: any = res;
        console.log(responseBody);
        let form = {
          files: file,
          documentId: responseBody?.body?.data?.documentId,
          documentName: responseBody?.body?.data?.documentName,
          documentType: "",
          documentSide: responseBody?.body?.data?.documentSide,
          noOfSignatures: null,
          fileType: responseBody?.body?.data?.fileType,
          fileName: responseBody?.body?.data?.fileName,
        };
        this.getArray(index).push(this.addFiles(form));
      }
    });
  }

  /**Add file array  */
  addFiles(data?: any): FormGroup {
    return this.formBuilder.group({
      files: [data ? data?.files : ""],
      documentId: [data ? data?.documentId : ""],
      documentName: [data ? data?.documentName : ""],
      documentType: [data ? data?.documentType : ""],
      documentSide: [data ? data?.documentSide : ""],
      noOfSignatures: [data ? data?.noOfSignatures : null],
      fileType: [data ? data?.fileType : ""],
      fileName: [data ? data?.fileName : ""],
      fileUrl: [data ? `${MICROSERVICE_URL}${data?.fileUrl}` : ""],
    });
  }

  /**Check for the title dropdown should not show again */
  titleChange(event) {
    const selectedValue = event.value
    let count = 0;
    this.titleCategory.controls.forEach((eachFormGroup, i) => {
      if (selectedValue == eachFormGroup.value.titleId) {
        count++;
      }
      if (count > 1) {
        this.titleCategory.at(i).get('titleId').setValue('');
        this.titleCategory.at(i).get('titleId').setErrors({ titleError: true })
      }
    })
  }
}
