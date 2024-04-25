import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgIssuanceBgInfoComponent } from './bg-issuance-bg-info.component';

describe('BgIssuanceBgInfoComponent', () => {
  let component: BgIssuanceBgInfoComponent;
  let fixture: ComponentFixture<BgIssuanceBgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgIssuanceBgInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgIssuanceBgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
