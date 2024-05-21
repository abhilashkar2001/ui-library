import { Pipe, PipeTransform } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

@Pipe({
  name: "customCurrency",
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private currencyPipe: CurrencyPipe) {}

  transform(
    value: number,
    currencyCode: string,
    digitsInfo: string = "1.2-2"
  ): string | null {
    if (value == null) return null;
    // Format the value using Angular's CurrencyPipe
    let formattedValue = this.currencyPipe.transform(
      value,
      currencyCode,
      "symbol-narrow",
      digitsInfo
    );

    // Remove the currency symbol using a regular expression
    return formattedValue
      ? formattedValue.replace(/[^0-9.,]/g, "").trim()
      : null;
  }
}
