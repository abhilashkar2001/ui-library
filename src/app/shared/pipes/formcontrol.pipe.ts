import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl, FormControl } from "@angular/forms";

@Pipe({ name: "formcontrol" })
export class FormControlPipe implements PipeTransform {
  transform(control: AbstractControl | undefined | any): FormControl {
    return control instanceof FormControl ? control : new FormControl();
  }
}
