import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NewDepositService } from 'app/modules/new-deposit/new-deposit.service';
import { FooterConstant } from './footer.constant';
import { FooterServiceService } from 'app/shared/services/footer-service.service';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { User } from '@onerumango/utils';
import { selectUser } from '@onerumango/utils';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
  socialMedia = FooterConstant.SOCIAL_MEDIA;
  footerPages = FooterConstant.FOOTER_PAGES;
  helpSection = FooterConstant.FOOTER_HELP_SECTION;
  hideNavItem = false;
  userDetails: any;
  @Output() scrollToTop = new EventEmitter<any>();
  isHideFooter = false;
  userProfile$: Observable<User | null>;
  subscriptions: Subscription[] = [];
  constructor(
    private showSideBar: NewDepositService,
    private footerService: FooterServiceService,
    private store: Store,
  ) {
    this.userProfile$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.loadUserProfile();
    this.footerService.isHideFooter().subscribe((resp) => {
      this.isHideFooter = resp;
    });
    this.showSideBar.getToken().subscribe((resp) => {
      this.hideNavItem = resp;
    });
  }

  loadUserProfile() {
    const loadUserProfileSub = this.userProfile$.subscribe((result) => {
      if (result) {
        this.userDetails = result;
      }
    });
    this.subscriptions.push(loadUserProfileSub);
  }

  opened(path: any) {
    if (path) window.location.href = path;
    else this.scrollToTop.emit({ scroll: true });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscribe) => subscribe.unsubscribe());
  }
}
