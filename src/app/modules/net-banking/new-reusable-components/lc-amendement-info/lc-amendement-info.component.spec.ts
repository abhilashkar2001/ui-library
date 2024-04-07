import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAmendementInfoComponent } from './lc-amendement-info.component';

describe('LcAmendementInfoComponent', () => {
  let component: LcAmendementInfoComponent;
  let fixture: ComponentFixture<LcAmendementInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LcAmendementInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LcAmendementInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
