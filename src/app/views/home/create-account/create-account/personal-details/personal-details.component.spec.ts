import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateAccountPersonalDetailsComponent } from "./personal-details.component";

describe("CreateAccountPersonalDetailsComponent", () => {
  let component: CreateAccountPersonalDetailsComponent;
  let fixture: ComponentFixture<CreateAccountPersonalDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAccountPersonalDetailsComponent],
    });
    fixture = TestBed.createComponent(CreateAccountPersonalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
