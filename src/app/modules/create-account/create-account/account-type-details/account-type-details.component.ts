import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-account-type-details',
  templateUrl: './account-type-details.component.html',
  styleUrls: ['./account-type-details.component.scss'],
})
export class AccountTypeDetailsComponent implements OnChanges {
  @Input() subClassList: any;
  @Output() customApply = new EventEmitter<any>();
  basisClass: any = '';
  endPoints = environment.microServiceURL;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private sessionStorageService: SessionStorageService,
  ) {
    this.basisClass = this.route.snapshot.params['id'];
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    this.subClassList = changes?.subClassList?.currentValue;
  }

  getFileUrl(url: any) {
    if (url.includes('https')) {
      return 'assets/images/normal_loan.svg';
    } else {
      return `${this.endPoints}${url}`;
    }
  }

  checkProduct(event: any) {
    if (event?.basisId) {
      this.applyForAccount(event);
    } else if (event?.productDetails === null) {
      this.snackBar.open('No Products Available', 'Ok', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
    } else if (event?.productDetails?.length > 1) {
      this.customApply.emit({
        classDetails: event,
        subClass: event?.subClass,
      });
    } else if (event?.clasDetails.productDetails?.length == 1) {
      this.customApply.emit({
        classDetails: event.clasDetails,
        subClass: event?.subClass,
      });
    }
  }

  applyForAccount(event: any) {
    const payload = {
      accountType: event.basisName,
      basisDetailsId: event.basisId,
      processCycleCode: event.processCycleCode,
    };
    this.sessionStorageService.setLoanBasisDetails(payload);
    this.router.navigate([`/account/open/${event.basisId}`]);
  }

  apply(event: any) {
    this.checkProduct(event);
  }
}
