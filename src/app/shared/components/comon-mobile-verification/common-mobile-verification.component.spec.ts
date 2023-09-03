import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonMobileVerificationComponent } from '../..';



describe('MobileVerificationComponent', () => {
  let component: CommonMobileVerificationComponent;
  let fixture: ComponentFixture<CommonMobileVerificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommonMobileVerificationComponent]
    });
    fixture = TestBed.createComponent(CommonMobileVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
