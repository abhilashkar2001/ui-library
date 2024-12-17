import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-bg-issuance-bg-info',
  templateUrl: './bg-issuance-bg-info.component.html',
  styleUrls: ['./bg-issuance-bg-info.component.scss'],
})
export class BgIssuanceBgInfoComponent implements OnInit {
  @Input() bgIssuanceBgInfoForm!: FormGroup;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
  }

  ngOnInit(): void {}
}
