import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsConditionsComponent } from 'app/modules/origination/modules/shared-origination/terms-conditions/terms-conditions.component';

describe('TermsConditionsComponent', () => {
  let component: TermsConditionsComponent;
  let fixture: ComponentFixture<TermsConditionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TermsConditionsComponent],
    });
    fixture = TestBed.createComponent(TermsConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
