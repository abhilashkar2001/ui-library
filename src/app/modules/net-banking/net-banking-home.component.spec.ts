import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NetBankingHomeComponent } from "./net-banking-home.component";

describe("NetBankingHomeComponent", () => {
  let component: NetBankingHomeComponent;
  let fixture: ComponentFixture<NetBankingHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetBankingHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetBankingHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
