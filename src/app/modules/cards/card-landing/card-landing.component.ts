import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'app/shared/services/common-service/common.service';

@Component({
  selector: 'app-card-landing',
  templateUrl: './card-landing.component.html',
  styleUrls: ['./card-landing.component.scss'],
})
export class CardLandingComponent implements OnInit {
  constructor(
    private router: Router,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    //please don't remove from here
    this.updateCurrentRoute();
  }

  updateCurrentRoute() {
    this.commonService.updateData(this.router.url.split('?')[0]);
  }
}
