import { Injectable } from "@angular/core";
import { environment } from "./environments/environment";

@Injectable({
  providedIn: "root",
})
export class ConsoleHideService {
  constructor() {}

  disableConsoleInProduction(): void {
    if (environment.production) {
      console.warn(`🚨   Console output is disabled on production!`);
      console.log = function (): void {};
      console.debug = function (): void {};
      console.warn = function (): void {};
      console.info = function (): void {};
    }
  }
}
