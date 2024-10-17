import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgAmendBgInfoComponent } from './bg-amend-bg-info.component';

describe('BgAmendBgInfoComponent', () => {
  let component: BgAmendBgInfoComponent;
  let fixture: ComponentFixture<BgAmendBgInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BgAmendBgInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BgAmendBgInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
