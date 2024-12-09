import { Pipe, PipeTransform } from "@angular/core";
import { FormArray } from "@angular/forms";

@Pipe({
  name: "formarray"
})
export class FormArrayPipe implements PipeTransform {
  transform(value: any) {
    return value as FormArray;
  }
}
