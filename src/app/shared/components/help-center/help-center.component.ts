import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpCenterService } from 'app/shared/services/helpCenter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss'],
})
export class HelpCenterComponent implements OnInit, OnDestroy {
  isOpen = false;
  private subscription!: Subscription;

  constructor(
    private helpCenterService: HelpCenterService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.subscription = this.helpCenterService.isOpen$.subscribe((state) => {
      this.isOpen = state;
      this.cdr.detectChanges();
    });

    this.router.events.subscribe(() => {
      this.helpCenterService.closeHelpCenter();
    });
  }

  closeHelp() {
    this.helpCenterService.toggleHelpCenter();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
