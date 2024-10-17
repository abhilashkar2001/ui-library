import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmendmentLcInfoComponent } from './amendment-lc-info.component';

describe('AmendmentLcInfoComponent', () => {
  let component: AmendmentLcInfoComponent;
  let fixture: ComponentFixture<AmendmentLcInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmendmentLcInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmendmentLcInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
