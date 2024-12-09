import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentUploadComponent } from "./document-upload.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

describe("DocumentUploadComponent", () => {
  let component: DocumentUploadComponent;
  let fixture: ComponentFixture<DocumentUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentUploadComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatSelectModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
