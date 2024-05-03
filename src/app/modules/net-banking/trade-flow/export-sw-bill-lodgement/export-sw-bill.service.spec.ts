import { TestBed } from '@angular/core/testing';

import { ExportSwBillService } from './export-sw-bill.service';

describe('ExportSwBillService', () => {
  let service: ExportSwBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportSwBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
