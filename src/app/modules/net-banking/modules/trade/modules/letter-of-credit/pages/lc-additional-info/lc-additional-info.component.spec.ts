import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LcAdditionalInfoComponent } from './lc-additional-info.component';

describe('LcAdditionalInfoComponent', () => {
  let component: LcAdditionalInfoComponent;
  let fixture: ComponentFixture<LcAdditionalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LcAdditionalInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LcAdditionalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
