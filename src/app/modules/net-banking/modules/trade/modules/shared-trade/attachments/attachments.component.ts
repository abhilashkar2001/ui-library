import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { IcHttpResponseModel } from 'app/shared/models/ic-http-response.model';
import { CommonService } from 'app/shared/services/common-service/common.service';
import { GenericValueService } from 'app/shared/services/generic-value.service';
import { environment } from 'environments/environment';
import { BgSummaryServiceService } from '../bg-summary/bg-summary-service.service';

const MICROSERVICE_URL = environment.microServiceURL;

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
})
export class AttachmentsComponent implements OnInit {
  @Input() updateParentModel:
    | ((part: Partial<any>, isFormValid: boolean) => void)
    | any;
  attachementInfoForm!: FormGroup;
  titles: any[] = [
    'BG Text',
    'Contract Copy',
    'Declaration',
    'Approvals',
    'Others',
    'CQW',
  ];
  fileNamelength: number | any;
  showUplodad = false;

  slectedFiles: File[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private bgService: BgSummaryServiceService,
    private router: Router,
    private genericValueService: GenericValueService,
  ) {}

  ngOnInit(): void {
    this.buildAttachmentInfoForm();
    this.addTitleCategory();
    const id = this.router.routerState.root.snapshot.queryParams['id'];
    this.fetchGenericValue();
    if (id) {
      this.fetchAttachments(id);
    }
  }

  fetchGenericValue() {
    this.genericValueService.loadGenericValue(['TITLE']).subscribe((res) => {
      console.log(res);
    });
  }

  fetchAttachments(id: any) {
    this.bgService
      .fetchAttachments(id)
      .subscribe((res: IcHttpResponseModel<any> | any) => {
        if (res?.statusCode == 200 && res?.data) {
          const data = res?.data[0]?.attachmentModel;
          this.attachMentModel.clear();
          data?.forEach((item: any) => {
            this.attachMentModel.push(this.createDocArray(item));
          });
        }
      });
  }

  /**Buildform*/
  buildAttachmentInfoForm() {
    this.attachementInfoForm = this.formBuilder.group({
      attachMentModel: this.formBuilder.array([]),
    });

    this.attachementInfoForm.valueChanges.subscribe(() => {
      console.log(this.attachMentModel['controls']);
      this.updateParentModel(this.attachMentModel.value, this.checkform());
    });
  }

  checkform() {
    return this.attachementInfoForm.valid;
  }
  public get attachMentModel(): FormArray | any {
    return this.attachementInfoForm?.get('attachMentModel') as FormArray;
  }

  //customerArray
  createDocArray(data?: any) {
    return this.formBuilder.group({
      title: [data ? data.title : ''],
      titleDescription: [data ? data.titleDescription : ''],
      fileUplodedArray: this.formBuilder.array([]),
      id: [data?.id ?? null],
    });
  }

  /**Getting Controle Of fileUploded Array */
  addTitleCategory(data?: any) {
    this.attachMentModel.push(this.createDocArray(data));
    // Initialize file length as 0 for each iteration
    this.fileNamelength = 0;
    for (let i = 0; i < this.attachMentModel['controls']?.length; i++) {
      this.attachementInfoForm.valueChanges.subscribe(() => {
        this.callUpdateAttachmentModel(i);
      });
    }
  }

  callUpdateAttachmentModel(i: any) {
    const fileUplodedArrayControls =
      this.attachMentModel['controls'][i].get('fileUplodedArray')['controls'];
    if (fileUplodedArrayControls && fileUplodedArrayControls.length > 0) {
      const documentIdControl = fileUplodedArrayControls[0].get('documentId');
      if (documentIdControl) {
        const attachMentModel: any = [];
        this.attachMentModel.value.forEach((element: any) => {
          if (element.fileUplodedArray?.length > 0) {
            const obj = {
              title: element.title,
              documentId: element.fileUplodedArray[0].documentId,
              titleDescription: element.titleDescription,
              attachmentId: null,
            };
            attachMentModel.push(obj);
          }
          setTimeout(() => {
            this.updateParentModel(
              {
                applicantId: null,
                masterId: null,
                attachMentModel: attachMentModel,
              },
              this.checkform(),
            );
          }, 200);
        });
      }
    }
  }

  /**Remove the titlecategory */
  removeTitleCategoty(index: number) {
    this.attachMentModel.removeAt(index);
  }

  public getArray(i: any) {
    return this.attachMentModel.controls[i]?.get(
      'fileUplodedArray',
    ) as FormArray;
  }

  fileName(event: any, index: any) {
    this.showUplodad = true;
    this.slectedFiles = event.target.files;
    // const file: File = event.target.files[0];
    Array.from(event?.target?.files).forEach((file: File | any) => {
      console.log('Uploading file:', file.name);
      this.uploadDocument(file, index);
    });
  }

  uploadDocument(file: any, index: any) {
    const formData = new FormData();
    const data = {
      // documentName: "Others Document",
      documentType: '',
      documentNumber: '',
      documentSide: index,
      fileName: file.name,
      fileType: file.type,
      verificationType: 'Attachments',
    };
    formData.append('data', JSON.stringify(data));
    formData.append('file', file);
    formData.append('module', 'document');
    this.commonService.uploadDocument(formData).subscribe((res) => {
      if (res?.data) {
        const form = {
          files: file,
          documentId: res?.data?.documentId,
          documentName: res?.data?.documentName,
          documentType: '',
          documentSide: res?.data?.documentSide,
          noOfSignatures: null,
          fileType: res?.data?.fileType,
          fileName: res?.data?.fileName,
        };
        this.getArray(index).push(this.addFiles(form));
      }
    });
  }

  /**Add file array  */
  addFiles(data?: any): FormGroup {
    return this.formBuilder.group({
      files: [data ? data?.files : ''],
      documentId: [data ? data?.documentId : ''],
      documentName: [data ? data?.documentName : ''],
      documentType: [data ? data?.documentType : ''],
      documentSide: [data ? data?.documentSide : ''],
      noOfSignatures: [data ? data?.noOfSignatures : null],
      fileType: [data ? data?.fileType : ''],
      fileName: [data ? data?.fileName : ''],
      fileUrl: [data ? `${MICROSERVICE_URL}${data?.fileUrl}` : ''],
    });
  }

  /**Check for the title dropdown should not show again */
  titleChange(event: any) {
    const selectedValue = event.value;
    let count = 0;
    this.attachMentModel.controls.forEach((eachFormGroup: any, i: any) => {
      if (selectedValue == eachFormGroup.value.title) {
        count++;
      }
      if (count > 1) {
        this.attachMentModel.at(i).get('title')?.setValue('');
        this.attachMentModel
          .at(i)
          .get('title')
          ?.setErrors({ titleError: true });
      }
    });
  }
}
