import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PersonalCustomDetailsComponent } from "./personal-details.component";

describe("PersonalCustomDetailsComponent", () => {
  let component: PersonalCustomDetailsComponent;
  let fixture: ComponentFixture<PersonalCustomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PersonalCustomDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalCustomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
