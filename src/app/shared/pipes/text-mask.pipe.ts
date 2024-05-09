import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "textMask",
})
export class TextMaskPipe implements PipeTransform {
  transform(value: string, numChars: number = 4): string {
    const length = value?.length;
    const unMasked =
      length > numChars ? value?.substring(0, length - numChars) : "";
    return unMasked + "X".repeat(numChars);
  }
}
