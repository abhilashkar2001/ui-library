import { Injectable } from '@angular/core';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConsoleHideService {
  disableConsoleInProduction(): void {
    if (environment.production) {
      console.warn(`🚨   Console output is disabled on production!`);
      console.log = () => void {};
      console.debug = () => void {};
      console.warn = () => void {};
      console.info = () => void {};
    }
  }
}
