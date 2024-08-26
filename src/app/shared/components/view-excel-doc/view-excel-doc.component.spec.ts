import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewLoanDocComponent } from "./view-loan-doc.component";

describe("ViewLoanDocComponent", () => {
  let component: ViewLoanDocComponent;
  let fixture: ComponentFixture<ViewLoanDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewLoanDocComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewLoanDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
