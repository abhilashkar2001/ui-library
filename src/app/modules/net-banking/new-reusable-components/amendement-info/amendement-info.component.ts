import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-amendement-info',
  templateUrl: './amendement-info.component.html',
  styleUrls: ['./amendement-info.component.scss']
})
export class AmendementInfoComponent implements OnInit {
  @Input() amendmentType:any = "BG Physical Amendment";
  // @Input() amendmentType:any = "BG Amendment";
  today = new Date();
  amountArray:any[] = ["300", "23443", "987"];
  bgAmendmentControles:any[] = ["effectiveDate" , "amendmentNumber","issueBrranch","bankGuarenteeamendment", "additionalInfo"]
  bgPhysicalAmendment:any[] = ["bgNumber" , "currentAmount" , "amendAmount" , "commentstoBank","feeAmount"]
  amdmentFormGroup:FormGroup
  feeAmountArray:any[] = ["CurrentFee","CustomFee"]

  constructor(private fb : FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
    if(this.amendmentType ==  "BG Amendment"){
      this.addBgAmendmentControle();
    }
    if(this.amendmentType == "BG Physical Amendment"){
      this.addPhysicalAmendmentControle();
    }
  }
  addBgAmendmentControle(){
    this.bgAmendmentControles.map((controles)=>{
      this.amdmentFormGroup.addControl(controles , new FormControl(''));
    })
  }
  addPhysicalAmendmentControle(){
    this.bgPhysicalAmendment.map(controle=>{
      this.amdmentFormGroup.addControl(controle,new FormControl(""));
    })
  }
  buildForm(item?){
    this.amdmentFormGroup = this.fb.group({
      valueDate:[item?.valueDate?? ""],
      requestDate:[item?.requestDate??""],
      newExpireDate:[item?.newExpireDate??""],
      currentExpireDate:[item?.currentExpireDate??""],
      newClaimPeriod:[item?.newClaimPeriod??""],
      currentClaimPeriod:[item?.currentClaimPeriod??""],
      newExpireIncDate:[item?.newExpireIncDate ?? ""],
      currentExpireIncDate:[item?.currentExpireIncDate ?? ""],
      amountChnage:[item?.amountChnage??""]
    })
  }

}
