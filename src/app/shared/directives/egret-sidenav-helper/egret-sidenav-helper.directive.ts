import {
  Directive,
  OnInit,
  OnDestroy,
  HostBinding,
  Input,
  HostListener,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatchMediaService } from 'app/shared/services/match-media.service';
import { EgretSidenavHelperService } from './egret-sidenav-helper.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaObserver } from '@ngbracket/ngx-layout';

@Directive({
  selector: '[appEgretSidenavHelper]',
})
export class EgretSidenavHelperDirective implements OnInit, OnDestroy {
  @HostBinding('class.is-open')
  isOpen: boolean;

  @Input()
  id: string | any;

  @Input()
  isOpenBreakpoint: string | any;

  private unsubscribeAll: Subject<any>;

  constructor(
    private matchMediaService: MatchMediaService,
    private egretSidenavHelperService: EgretSidenavHelperService,
    private matSidenav: MatSidenav,
    private mediaObserver: MediaObserver,
  ) {
    // Set the default value
    this.isOpen = true;

    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.egretSidenavHelperService.setSidenav(this.id, this.matSidenav);

    if (this.mediaObserver.isActive(this.isOpenBreakpoint)) {
      this.isOpen = true;
      this.matSidenav.mode = 'side';
      this.matSidenav.toggle(true);
    } else {
      this.isOpen = false;
      this.matSidenav.mode = 'over';
      this.matSidenav.toggle(false);
    }

    this.matchMediaService.onMediaChange
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        if (this.mediaObserver.isActive(this.isOpenBreakpoint)) {
          this.isOpen = true;
          this.matSidenav.mode = 'side';
          this.matSidenav.toggle(true);
        } else {
          this.isOpen = false;
          this.matSidenav.mode = 'over';
          this.matSidenav.toggle(false);
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next(1);
    this.unsubscribeAll.complete();
  }
}

@Directive({
  selector: '[appEgretSidenavToggler]',
})
export class EgretSidenavTogglerDirective {
  @Input()
  public id: any;

  constructor(private egretSidenavHelperService: EgretSidenavHelperService) {}

  @HostListener('click')
  onClick() {
    // console.log(this.egretSidenavHelperService.getSidenav(this.id))
    this.egretSidenavHelperService.getSidenav(this.id).toggle();
  }
}
