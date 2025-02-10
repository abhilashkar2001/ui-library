import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {
  constructor(public translate: TranslateService) {
    // Translator init
    const browserLang: string | any = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
}
