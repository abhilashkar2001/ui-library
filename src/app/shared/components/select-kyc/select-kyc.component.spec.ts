import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectKycComponent } from './select-kyc.component';

describe('SelectKycComponent', () => {
  let component: SelectKycComponent;
  let fixture: ComponentFixture<SelectKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectKycComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
