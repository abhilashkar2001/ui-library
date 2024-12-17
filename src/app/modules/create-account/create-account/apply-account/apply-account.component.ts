import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';

@Component({
  selector: 'app-apply-account',
  templateUrl: './apply-account.component.html',
  styleUrls: ['./apply-account.component.scss'],
})
export class ApplyAccountComponent implements OnInit {
  subClassList: any[] = [];
  subClass: any;
  constructor(
    private api: OpenAccountService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.scrollToTop();
    this.subClass = this.route.snapshot.params['id'];
    this.fetchSubClass();
  }

  fetchSubClass() {
    this.api.fetchSubClass(this.subClass).subscribe((resp) => {
      if (resp?.statusCode === 200) this.subClassList = resp.data;
    });
  }

  customApply(event: any) {
    this.scrollToTop();
    this.subClassList = event['classDetails']['productDetails'];
    this.subClass = event.subClass;
    this.cdr.detectChanges();
  }

  scrollToTop() {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
  }
}
