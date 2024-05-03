import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceDetailsComponent } from './remittance-details.component';

describe('RemittanceDetailsComponent', () => {
  let component: RemittanceDetailsComponent;
  let fixture: ComponentFixture<RemittanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemittanceDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemittanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
