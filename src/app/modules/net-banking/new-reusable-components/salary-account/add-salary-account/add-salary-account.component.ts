import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ReusablePincodePopupComponent } from 'app/shared/components/reusable-pincode-popup/reusable-pincode-popup.component';
import { SalaryAccountService } from '../salary-account.service';
import { debounce, debounceTime } from 'rxjs/operators';
import { CustomSuccessPopupComponent } from 'app/shared/components/custom-success-popup/custom-success-popup.component';

@Component({
  selector: 'app-add-salary-account',
  templateUrl: './add-salary-account.component.html',
  styleUrls: ['./add-salary-account.component.scss']
})
export class AddSalaryAccountComponent implements OnInit {
  salaryAccountForm: FormGroup
  screenName: string = "Common";
  genericData = {
    PREFIX: [],
    GENDER: [],
    MARITALSTATUS:[],
    NATIONALITY:[],
    RESIDENCETYPE:[],
    RELATIONSHIPTYPE:[]
  };
  genederData: any;
  maritalData: any;
  prefixData: any;
  residencyData: any;
  countryData: any;
  pincodesData: any;
  constructor(private fb:FormBuilder,
    private router:Router,
    private dialog:MatDialog,
    private api:SalaryAccountService) { }

  ngOnInit(): void {
    this.buildForm();
    this.fetchGenericValues();
    this.fetchCountry();
  }
  buildForm(){
    this.salaryAccountForm= this.fb.group({
      customerId:[],
      customerNo:[],
      empNo:[],
      corporateId:[],
      prefix:[],
      firstName:[],
      lastName:[],
      dateOfBirth:[],
      email:[],
      gender:[],
      address:[],
      residenceType:[],
      country:[],
      pincode:[],
      state:[],
      city:[],
      nationality:[],
      mobile:[],
      mobtCode:[]
    })
    this.salaryAccountForm.get('pincode').valueChanges.pipe(debounceTime(500)).subscribe(res=>{
      if(res) this.zipCode();
    })
  }
  goBack(){
    this.router.navigate(["user/dashboard/salary-account"]);
  }
  fetchGenericValues() {
    this.api
      .getGenericValue(this.screenName, Object.keys(this.genericData))
      .subscribe((res: any) => {
        if (res?.statusCode == 200) {            
          this.genederData=res.data.GENDER; 
          this.prefixData=res.data.PREFIX;
          this.residencyData=res.data.RESIDENCETYPE;
        }
      });
  }
  fetchCountry(){
    this.api.getCountry().subscribe(res=>{
      if (res?.statusCode == 200) {  
        this.countryData=res.data;
      }
    })
  }
  zipCode() {    
    this.api.getPinCodes(this.salaryAccountForm.get('pincode').value).subscribe(res=>{
      this.pincodesData=res.data;
      this.salaryAccountForm.get('city').setValue(res.data[0].city)
      this.salaryAccountForm.get('country').setValue(res.data[0].countryName)
      this.salaryAccountForm.get('state').setValue(res.data[0].state)
    })
  }
  saveRecord(){
    const cityVal=this.pincodesData.find((item)=>item.city==this.salaryAccountForm.value.city) 
    console.log(cityVal);
       
    const Address = [
      {
        address1: this.salaryAccountForm.value.address,
        address2:"",
        addressType:"",
        residenceType:this.salaryAccountForm.value.residenceType,
        countryName:this.salaryAccountForm.value.country,
        pincode: this.salaryAccountForm.value.pincode,
        stateName:this.salaryAccountForm.value.state,
        cityName: this.salaryAccountForm.value.city,
        cityId: cityVal.cityId,
        addressId: ""
      },
    ];
    const Contact = {
      mobile: Number(this.salaryAccountForm.value.mobile),
      email: this.salaryAccountForm.value.email,
      mobtCode:this.salaryAccountForm.value.mobtCode,
      contactId:"",
      address: Address,
    };
    var payload: any = {
      customerNo:null,
      customerId:null,
      corporateId:this.salaryAccountForm.value.corporateId,
      empNo:this.salaryAccountForm.value.empNo,
    onboardingStatus: "",
    primaryCustomer: true,
    prefix: this.salaryAccountForm.value.prefix,
    firstName: this.salaryAccountForm.value.firstName,
    lastName: this.salaryAccountForm.value.lastName,
    dateOfBirth:this.salaryAccountForm.value.dateOfBirth,
    gender: this.salaryAccountForm.value.gender,
    nationality: this.salaryAccountForm.value.nationality,
    source: "Website",
    kycStatus: null,
    documentId: null,
    contact:Contact
    }
    console.log(payload);
    
    this.api.saveCustomerDetails(payload).subscribe((resp:any)=>{
      console.log(resp);
      if(resp && resp.statusCode==201){
        const dialog = this.dialog.open(CustomSuccessPopupComponent,{
          data:{msg:resp.message,status:resp.status,reffNo:resp.data.customerId},
          width: "60%",
          disableClose: true,
          panelClass: "dialog-class",
        });
        dialog.afterClosed().subscribe((res) => {
          console.log(res);
          if(res=="Done"){
            this.goBack();
          }

        })
      }
    })
  }
}
