import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormGroup } from "@angular/forms";

@Pipe({
  name: "formgroup"
})
export class FormGroupPipe implements PipeTransform {
  transform(value: AbstractControl<any, any> | any) {
    return value as FormGroup;
  }
}
