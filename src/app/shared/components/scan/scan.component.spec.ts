// import { ComponentFixture, TestBed } from "@angular/core/testing";

// import { IrisIrisScanComponent } from "./iris-scan.component";
// import { SharedMaterialModule } from "app/shared/shared-material.module";
// import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
// import { HttpClientModule } from "@angular/common/http";

// describe("IrisIrisIrisScanComponent", () => {
//   let component: IrisIrisScanComponent;
//   let fixture: ComponentFixture<IrisIrisScanComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [IrisIrisScanComponent],
//       imports: [SharedMaterialModule, HttpClientModule],
//       providers: [
//         {
//           provide: MatDialogRef,
//           useValue: {},
//         },
//         {
//           provide: MAT_DIALOG_DATA,
//           useValue: {},
//         },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(IrisIrisScanComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it("should create", () => {
//     expect(component).toBeTruthy();
//   });
// });
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrisScanComponent } from './iris-scan.component';

describe('IrisScanComponent', () => {
  let component: IrisScanComponent;
  let fixture: ComponentFixture<IrisScanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IrisScanComponent]
    });
    fixture = TestBed.createComponent(IrisScanComponent);
    component = fixture.componentInstance;  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
