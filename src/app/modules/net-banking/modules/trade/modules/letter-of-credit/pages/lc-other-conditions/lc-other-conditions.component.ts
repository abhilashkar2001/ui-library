import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-lc-other-conditions",
  templateUrl: "./lc-other-conditions.component.html",
  styleUrls: ["./lc-other-conditions.component.scss"]
})
export class LcOtherConditionsComponent implements OnInit {
  lcOtherConditionForm!: FormGroup;
  @Input("updateParentModel") updateParentModel:
    | ((part: Partial<any>, isFormValid: boolean) => void)
    | any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  buildForm(data?: any) {
    this.lcOtherConditionForm = this.fb.group({
      plcOfRcptChngTo: [data?.plcOfRcptChngTo ?? ""],
      plcOfRcptChngFrom: [data?.plcOfRcptChngFrom ?? ""],
      plcOfFnlDstnTo: [data?.plcOfFnlDstnTo ?? ""],
      plcOfFnlDstnFrom: [data?.plcOfFnlDstnFrom ?? ""],
      partOfLdngTo: [data?.partOfLdngTo ?? ""],
      partOfLndgFrom: [data?.partOfLndgFrom ?? ""],
      partOfDschgTo: [data?.partOfDschgTo ?? ""],
      partOfDschgFrom: [data?.partOfDschgFrom ?? ""],
      docToBeWithIn: [data?.docToBeWithIn ?? ""],
      daysFrmDtOf: [data?.daysFrmDtOf ?? ""],
      narrative: [data?.narrative ?? ""],
      margin: [data?.margin ?? ""]
    });
    this.lcOtherConditionForm.valueChanges.subscribe(() => {
      let payload: any = {};
      payload = {
        lcType: "Amendment",
        amendmentInfo: this.lcOtherConditionForm.value
      };
      this.updateParentModel(
        {
          lcAmendmentAmendmentInfo: {
            payload
          }
        },
        this.checkForm()
      );
    });
  }

  checkForm() {
    return this.lcOtherConditionForm.valid;
  }
}
