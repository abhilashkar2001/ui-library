import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { CustomSuccessPopupComponent } from 'app/shared/components/custom-success-popup/custom-success-popup.component';
import { OCRService } from 'app/shared/services/ocr.service';
import { NotificationService } from 'app/shared/services/notification.service';
import { DocumentUploadService } from 'app/shared/services/document-upload.service';
import { SalaryAccountService } from '../salary-account/salary-account.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericValueService } from 'app/shared/services/generic-value.service';

@Component({
  selector: 'app-add-salary-account',
  templateUrl: './add-salary-account.component.html',
  styleUrls: ['./add-salary-account.component.scss'],
})
export class AddSalaryAccountComponent implements OnInit {
  salaryAccountForm!: FormGroup;
  genericData: any = {
    PREFIX: [],
    GENDER: [],
    MARITALSTATUS: [],
    NATIONALITY: [],
    RESIDENCETYPE: [],
    RELATIONSHIPTYPE: [],
    DOCUMENTNAME: [],
  };
  genederData: any;
  maritalData: any;
  prefixData: any;
  residencyData: any;
  countryData: any;
  pincodesData: any;
  customerInfoForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private api: SalaryAccountService,
    private snack: MatSnackBar,
    private ocrService: OCRService,
    private notificationService: NotificationService,
    private documentUploadService: DocumentUploadService,
    private genericValueService: GenericValueService,
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.fetchGenericValues();
    this.fetchCountry();
    this.customerInfoForm = this.fb.group({
      documents: this.fb.array([]),
    });
    this.addDocuments();
  }
  buildForm() {
    this.salaryAccountForm = this.fb.group({
      customerId: [],
      customerNo: [],
      empNo: [],
      corporateId: [],
      prefix: [],
      firstName: [],
      lastName: [],
      dateOfBirth: [],
      email: [],
      gender: [],
      address: [],
      residenceType: [],
      country: [],
      pincode: [],
      state: [],
      city: [],
      nationality: [],
      mobile: [],
      mobtCode: [],
    });
    this.salaryAccountForm
      .get('pincode')
      ?.valueChanges.pipe(debounceTime(500))
      .subscribe((res) => {
        if (res) this.zipCode();
      });
  }
  goBack() {
    this.router.navigate(['user/dashboard/salary-account']);
  }
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue(Object.keys(this.genericData))
      .subscribe((res: any) => {
        if (res?.statusCode == 200) {
          this.genederData = res.data.GENDER;
          this.prefixData = res.data.PREFIX;
          this.residencyData = res.data.RESIDENCETYPE;
          this.genericData.DOCUMENTNAME = res?.data?.DOCUMENTNAME;
        }
      });
  }
  fetchCountry() {
    this.api.getCountry().subscribe((res) => {
      if (res?.statusCode == 200) {
        this.countryData = res.data;
      }
    });
  }
  zipCode() {
    this.api
      .getPinCodes(this.salaryAccountForm.get('pincode')?.value)
      .subscribe((res) => {
        this.pincodesData = res.data;
        this.salaryAccountForm.get('city')?.setValue(res.data[0].city);
        this.salaryAccountForm
          .get('country')
          ?.setValue(res.data[0].countryName);
        this.salaryAccountForm.get('state')?.setValue(res.data[0].state);
      });
  }
  saveRecord() {
    const cityVal = this.pincodesData.find(
      (item: any) => item.city == this.salaryAccountForm.value.city,
    );
    console.log(cityVal);

    const Address = [
      {
        address1: this.salaryAccountForm.value.address,
        address2: '',
        addressType: '',
        residenceType: this.salaryAccountForm.value.residenceType,
        countryName: this.salaryAccountForm.value.country,
        pincode: this.salaryAccountForm.value.pincode,
        stateName: this.salaryAccountForm.value.state,
        cityName: this.salaryAccountForm.value.city,
        cityId: cityVal.cityId,
        addressId: '',
      },
    ];
    const Contact = {
      mobile: Number(this.salaryAccountForm.value.mobile),
      email: this.salaryAccountForm.value.email,
      mobtCode: this.salaryAccountForm.value.mobtCode,
      contactId: '',
      address: Address,
    };
    const payload: any = {
      customerNo: null,
      customerId: null,
      corporateId: this.salaryAccountForm.value.corporateId,
      empNo: this.salaryAccountForm.value.empNo,
      onboardingStatus: '',
      primaryCustomer: true,
      prefix: this.salaryAccountForm.value.prefix,
      firstName: this.salaryAccountForm.value.firstName,
      lastName: this.salaryAccountForm.value.lastName,
      dateOfBirth: this.salaryAccountForm.value.dateOfBirth,
      gender: this.salaryAccountForm.value.gender,
      nationality: this.salaryAccountForm.value.nationality,
      source: 'Website',
      kycStatus: null,
      documentId: null,
      contact: Contact,
    };
    console.log(payload);

    this.api.saveCustomerDetails(payload).subscribe((resp: any) => {
      console.log(resp);
      if (resp && resp.statusCode == 201) {
        const dialog = this.dialog.open(CustomSuccessPopupComponent, {
          data: {
            msg: resp.message,
            status: resp.status,
            reffNo: resp.data.customerId,
          },
          width: '60%',
          disableClose: true,
          panelClass: 'dialog-class',
        });
        dialog.afterClosed().subscribe((res) => {
          console.log(res);
          if (res == 'Done') {
            this.goBack();
          }
        });
      }
    });
  }

  get documentCtrl(): FormArray | any {
    return this.customerInfoForm.get('documents') as FormArray;
  }

  documentFormArray(data?: any) {
    return this.fb.group({
      documentName: [data?.documentType ?? ''],
      isProofOfAddress: [data?.isProofOfAddress ?? false],
      files: this.fb.array([]),
    });
  }

  documentFilesCtrl(index: any): FormArray {
    return this.documentCtrl.at(index).get('files') as FormArray;
  }

  documentFileFormArray(fileName: any, fileUrl: any, documentId: any) {
    return this.fb.group({
      fileName: [fileName ?? ''],
      fileUrl: [fileUrl ?? ''],
      documentId: [documentId ?? null],
    });
  }

  uploadDocument(event: any, index: any) {
    const file = event.target.files[0];
    if (
      this.documentCtrl.value.some((doc: any) =>
        doc?.files?.some((item: any) => item?.fileName.includes(file?.name)),
      )
    ) {
      this.notificationService.showError(
        'This document is already uploaded',
        'Please upload another document',
      );
      return;
    }
    const docdata: any = {};
    docdata.fileName = file?.name.split('.')[0];
    docdata.fileType = file?.type.split('/')[1];
    docdata.documentName = this.documentCtrl
      .at(index)
      .get('documentName')?.value;
    const formdata = new FormData();
    formdata.append('file', file);
    formdata.append('data', JSON.stringify(docdata));
    formdata.append('module', 'document');
    this.documentUploadService.uploadDocuments(formdata).subscribe((res) => {
      if ((res?.statusCode === 200 || res?.statusCode == 201) && res?.data) {
        const docname = this.genericData.DOCUMENTNAME.find(
          (res: any) =>
            res?.id == this.documentCtrl.at(index)?.get('documentName')?.value,
        )?.values;
        const type = docname.toLowerCase();
        const formdata = new FormData();
        formdata.append('image', file);
        formdata.append('lang', 'eng');
        formdata.append('imageType', this.getDocTypeforScan(type, index));
        this.ocrService.readAadharData(formdata).subscribe((resp) => {
          if (resp?.statusCode == 200) {
            if (
              Object.keys(resp?.data).filter(
                (value) =>
                  resp?.data[value] != 'Detail not found' &&
                  resp?.data[value] != null,
              )?.length < 1
            ) {
              this.snack.open(
                `Uploaded ${type} is not a valid ${type}`,
                'Ok!',
                {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                },
              );
              return;
            }
            this.documentFilesCtrl(index).push(
              this.documentFileFormArray(
                file.name,
                res?.data?.fileUrl,
                res?.data?.documentId,
              ),
            );
          } else {
            this.snack.open(`Uploaded ${type} is not a valid ${type}`, 'Ok!', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          }
        });
      }
    });
  }

  getDocTypeforScan(docname: any, index: any) {
    let docType;
    const fileindex =
      this.documentCtrl.controls[index]?.get('files')?.value.length;
    if (docname.includes('adhar') && fileindex == 0) {
      docType = 'adhaar';
    }
    if (docname.includes('adhar') && fileindex == 1) {
      docType = 'adhaar_back';
    }
    if (docname.includes('pan')) {
      docType = 'pan';
    }
    if (docname.includes('pass') && fileindex == 0) {
      docType = docname;
    }
    if (docname.includes('pass') && fileindex == 1) {
      docType = 'passport_back';
    }
    return docType;
  }

  addDocuments() {
    this.documentCtrl.push(this.documentFormArray());
  }

  removeDocument(i: any) {
    this.documentCtrl.removeAt(i);
  }

  setGenericType(
    value: string,
    control: FormGroup | any,
    key: string,
    genericName: string,
  ) {
    const genericValue = this.genederData[genericName].find(
      (item: any) => item.id == value,
    ).values;
    control.get(key).setValue(genericValue);
  }
}
