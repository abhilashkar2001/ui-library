import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemittanceSummeryComponent } from './remittance-summery.component';

describe('RemittanceSummeryComponent', () => {
  let component: RemittanceSummeryComponent;
  let fixture: ComponentFixture<RemittanceSummeryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemittanceSummeryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemittanceSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
