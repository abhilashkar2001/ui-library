import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadAccountComponent } from './file-upload-account.component';

describe('FileUploadAccountComponent', () => {
  let component: FileUploadAccountComponent;
  let fixture: ComponentFixture<FileUploadAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadAccountComponent]
    });
    fixture = TestBed.createComponent(FileUploadAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
