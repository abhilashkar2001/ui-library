import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
  Input,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SearchService } from '../search.service';
import { Router } from '@angular/router';
import { AutoFocusDirective } from 'app/shared/directives/auto-focus.directive';

@Component({
  selector: 'app-egret-search-input-over',
  templateUrl: './search-input-over.component.html',
  styleUrls: ['./search-input-over.component.scss'],
})
export class SearchInputOverComponent implements OnInit, OnDestroy {
  isOpen: boolean | undefined;
  @ViewChildren(AutoFocusDirective) searchInput!: QueryList<AutoFocusDirective>;
  @Input() resultPage: string | undefined;
  @Input() placeholder = 'Search here';
  @Output() search = new EventEmitter();
  searchCtrl = new UntypedFormControl();
  searchCtrlSub: Subscription | undefined;
  constructor(
    private searchService: SearchService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.searchCtrl.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      this.search.emit(value);
      this.searchService.searchTerm.next(value);
    });
  }

  ngOnDestroy() {
    if (this.searchCtrlSub) {
      this.searchCtrlSub.unsubscribe();
    }
  }
  navigateToResult() {
    if (this.resultPage) {
      this.router.navigateByUrl(this.resultPage);
    }
  }
  open() {
    this.isOpen = true;
    this.navigateToResult();

    setTimeout(() => {
      this.searchInput?.first.focus();
    });
  }
  close() {
    this.isOpen = false;
  }
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
