import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalIdentificationComponent } from './personal-identification.component';

describe('PersonalIdentificationComponent', () => {
  let component: PersonalIdentificationComponent;
  let fixture: ComponentFixture<PersonalIdentificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PersonalIdentificationComponent],
    });
    fixture = TestBed.createComponent(PersonalIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
