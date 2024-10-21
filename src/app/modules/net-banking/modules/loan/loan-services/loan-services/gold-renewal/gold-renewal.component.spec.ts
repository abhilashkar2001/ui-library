import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldRenewalComponent } from './gold-renewal.component';

describe('GoldRenewalComponent', () => {
  let component: GoldRenewalComponent;
  let fixture: ComponentFixture<GoldRenewalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldRenewalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldRenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
