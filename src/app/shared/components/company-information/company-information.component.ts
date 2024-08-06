import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { CityService } from "app/shared/services/city.service";
import { CountryService } from "app/shared/services/country-service";
import { DocumentUploadService } from "app/shared/services/document-upload.service";
import { GenericValueService } from "app/shared/services/generic-value.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";

@Component({
  selector: "app-company-information",
  templateUrl: "./company-information.component.html",
  styleUrls: ["./company-information.component.scss"],
})
export class CompanyInformationComponent implements OnInit {
  @Output() onCustomSubmit = new EventEmitter<{}>();
  @Output() onBackEvent = new EventEmitter<{}>();
  @Output() customFormGroup = new EventEmitter<{}>();
  @Input() personalDetails: any;
  @Input() basisId: any;
  @Input() customerInfo;

  _parentForm: FormGroup;
  corporateCustId: any;
  miscellaneousId: any;
  customerCategoryArr: any;
  chargeCategoryArr: any;
  countryList: any;
  nationalityList: any;
  selectedIndex = 0;
  @ViewChild("treeTemplate", { static: true }) treeTemplate: TemplateRef<any>;

  genericValue = {
    OWNERSHIP: [],
    FUNDBY: [],
    RESIDENCETYPE: [],
    COMPANYTYPE: [],
    SOURCEOFINCOME: [],
    SEGMENT: [],
    PARENTCOMPANY: [],
  };

  currencyList = [];

  constructor(
    private fb: FormBuilder,
    private documentUploadService: DocumentUploadService,
    private cityService: CityService,
    private countryService: CountryService,
    private genericValueService: GenericValueService,
    private openAccountService: OpenAccountService
  ) {}

  ngOnInit(): void {
    this.buildCompanyForm();
    this.fetchCountries();
    this.fetchGenericValues();
    this.corporateCustId = JSON.parse(
      sessionStorage.getItem("corporateCustId")
    );
    this.miscellaneousId = JSON.parse(
      sessionStorage.getItem("miscellaneousId")
    );
    this.fetchCompanyDetails();
  }

  buildCompanyForm() {
    this._parentForm = this.fb.group({
      screenCode: parseInt(sessionStorage.getItem("currentScreenCode")),
      originationModel: this.fb.group({
        basisDetailsId: [""],
        loanAmount: [""],
      }),
      corporateCustomer: this.addCorporateCustomer(),
      miscellaneous: this.addMiscellaneous(),
    });
  }

  addCorporateCustomer() {
    return this.fb.group({
      corporateCustId: [this.corporateCustomer ?? ""],
      companyName: ["", [Validators.required]],
      companyType: [" ", [Validators.required]],
      numberOfDirectors: ["", [Validators.required]],
      segment: [""],
      natureOfBusiness: [""],
      countryOfIncorporationCode: ["", [Validators.required]],
      dateOfIncorporation: ["", [Validators.required]],
      registrationNumber: ["", [Validators.required]],
      tinNumber: ["", [Validators.required]],
      sourceOfIncome: ["", [Validators.required]],
      others: [""],
      parentCompanyId: [""],
      organisationChartFileName: [""],
      organisationChartUrl: [""],
      organisationChartId: [""],
      financialDetails: this.fb.array([]),
      contact: this.addContact(),
    });
  }
  addMiscellaneous() {
    return this.fb.group({
      miscellaneousId: [this.miscellaneous ?? ""],
      customerCategoryId: [""],
      customerChargeCategoryId: [""],
      taxCategory: [""],
      swiftCode: [""],
    });
  }
  addContact(data?) {
    return this.fb.group({
      email: [data?.contact?.email ?? ""],
      mobile: [data?.contact?.mobile ?? ""],
      mobtCode: [Number(data?.contact?.mobtCode) ?? ""],
      whatsappNo: [data?.contact?.whatsappNo ?? ""],
      waptCode: [Number(data?.contact?.waptCode) ?? ""],
      alternativeNumber: [data?.contact?.alternativeNumber ?? ""],
      altCode: [Number(data?.contact?.altCode) ?? ""],
      telephone: [data?.contact?.telephone ?? ""],
      contactId: [data?.contact?.contactId ?? ""],
      address: this.fb.array([
        this.fb.group({
          address1: [data?.contact.address[0]?.address1 ?? ""],
          address2: [data?.contact.address[0]?.address2 ?? ""],
          residenceType: [data?.contact.address[0]?.residenceType ?? 7521],
          residenceTypeValue: [
            data?.contact.address[0]?.residenceTypeValue ?? "",
          ],
          countryName: [data?.contact.address[0]?.countryName ?? ""],
          pincode: [data?.contact.address[0]?.pincode ?? ""],
          stateName: [data?.contact.address[0]?.stateName ?? ""],
          cityName: [data?.contact.address[0]?.cityName ?? ""],
          cityId: [data?.contact.address[0]?.cityId ?? 1],
        }),
      ]),
    });
  }

  get corporateCustomer(): FormGroup {
    return this._parentForm?.get("corporateCustomer") as FormGroup;
  }

  get miscellaneous(): FormGroup {
    return this._parentForm?.get("miscellaneous") as FormGroup;
  }

  get contact(): FormGroup {
    return this.corporateCustomer.get("contact") as FormGroup;
  }
  get addressControl(): FormArray {
    return this.corporateCustomer.get("contact").get("address") as FormArray;
  }

  get financialDetails(): FormArray {
    return this.corporateCustomer.get("financialDetails") as FormArray;
  }

  financeInfo(index): FormArray {
    return this.financialDetails.at(index).get("financeInfo") as FormArray;
  }

  pushFinanceMaster(data?) {
    this.financialDetails.push(
      this.fb.group({
        financeType: [data?.financeType ?? ""],
        financeMasterId: [data?.financeMasterId ?? ""],
        financeInfo: this.fb.array([]),
      })
    );
    if (data?.financeInfo?.length > 0) {
      data?.financeInfo?.forEach((item) => {
        this.financeInfo(this.financialDetails.length - 1).push(
          this.financialInfoForm(item)
        );
      });
    } else {
      this.financeInfo(this.financialDetails.length - 1).push(
        this.financialInfoForm()
      );
    }
  }

  pushFinancialInfo(index) {
    this.financeInfo(index).push(this.financialInfoForm());
  }

  financialInfoForm(data?) {
    return this.fb.group({
      financialId: [data?.financialId ?? ""],
      year: [""],
      currencyCode: [data?.currencyCode ?? ""],
      ammount: [data?.ammount ?? ""],
      documentId: [data?.documentId ?? ""],
      documentName: [data?.documentName ?? ""],
      doucumentUrl: [data?.doucumentUrl ?? ""],
    });
  }

  addCard(currentForm: FormArray) {
    currentForm.push(this.financialInfoForm());
  }

  deleteFinancialInfo(index: number, financeIndex: number) {
    this.financeInfo(index).removeAt(financeIndex);
  }

  /**
   * Handles the change event when a file is selected.
   * Uploads the selected file to the server and updates the form accordingly.
   * @param event The file change event containing the selected file
   * @param Form The form group to update with the uploaded file information (optional)
   */
  fileChange(event, Form?) {
    const file = event.target.files[0];
    let docdata: any = {};
    docdata.fileName = file?.name.split(".")[0];
    docdata.fileType = file?.type.split("/")[1];
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("data", JSON.stringify(docdata));
    formdata.append("module", "document");
    this.documentUploadService.uploadDocuments(formdata).subscribe((res) => {
      if ((res?.statusCode === 200 || res?.statusCode === 201) && res?.data) {
        if (Form) {
          Form.get("documentName").setValue(res?.data?.fileName);
          Form.get("documentId").setValue(res?.data?.documentId);
          Form.get("doucumentUrl").setValue(res?.data?.fileUrl);
        } else {
          const updatedData = res?.data;
          this.corporateCustomer
            .get("organisationChartFileName")
            .patchValue(updatedData?.fileName);
          this.corporateCustomer
            .get("organisationChartUrl")
            .patchValue(updatedData?.fileUrl);
          this.corporateCustomer
            .get("organisationChartId")
            .patchValue(updatedData?.documentId);
        }
      }
    });
  }

  fetchCompanyDetails() {
    this.openAccountService.fetchCompanyDetails().subscribe((res: any) => {
      console.log(res);
      this._parentForm.patchValue(res?.data);
    });
  }

  /** fetch all generic value form generic value maintenance for dropdown values */
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
  }

  getCityandStateByZipcode(index) {
    let addressCtrl = this.addressControl.at(index);
    let pincode = addressCtrl.get("pincode").value;
    if (pincode) {
      this.cityService.fetchZipcodeDetails(pincode).subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          addressCtrl.get("cityName").setValue(res?.data[0]?.city);
          addressCtrl.get("cityId").setValue(res?.data[0]?.cityId);
          addressCtrl.get("stateName").setValue(res?.data[0]?.state);
          addressCtrl.get("countryName").setValue(res?.data[0]?.countryName);
          const isdCode = this.getISDCode(
            res?.data[0]?.countryName
          )?.countryTelIsdCode;
          this.patchIsdCode(isdCode);
        } else {
          this.clearData(addressCtrl);
        }
      });
    } else {
      this.clearData(addressCtrl);
    }
  }
  fetchCountries() {
    this.countryService.getCountries().subscribe((res: any) => {
      if (res?.statusCode === 200 && res?.data) {
        this.countryList = res?.data?.filter(
          (d) => d?.authStatus === "AUTHORIZED"
        );
        this.nationalityList = res?.data?.filter(
          (nationality: any) => nationality?.nationality
        );
      }
    });
  }
  setGenericType(
    value: string,
    control: FormGroup,
    key: string,
    genericName: string
  ) {
    const genericValue = this.genericValue[genericName].find(
      (item) => item.id == value
    ).values;
    control.get(key).setValue(genericValue);
  }

  /**
   * patch isd code in mobile number, alternative number and whatsapp number
   * @param isdCode isd code of the selected country to be patched
   */
  patchIsdCode(isdCode) {
    this.corporateCustomer.get("contact.altCode").setValue(isdCode);
    this.corporateCustomer.get("contact.mobtCode").setValue(isdCode);
    this.corporateCustomer.get("contact.waptCode").setValue(isdCode);
  }

  /**
   * @param country
   * @returns the desired country from the country list
   */
  getISDCode(country) {
    let countryCode: any = this.countryList?.find(
      (item) => item?.countryName === country
    );
    return countryCode;
  }
  clearData(addressCtrl) {
    addressCtrl.get("cityName").setValue("");
    addressCtrl.get("cityId").setValue("");
    addressCtrl.get("stateName").setValue("");
    addressCtrl.get("pincode").setValue("");
  }

  onConfirm() {
    console.log(this._parentForm);
    if (this._parentForm.invalid) return;

    this.onCustomSubmit.emit({
      status: true,
      companyDetails: this._parentForm,
    });
  }
}
