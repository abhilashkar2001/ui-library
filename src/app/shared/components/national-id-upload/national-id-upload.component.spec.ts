import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalIdUploadComponent } from './national-id-upload.component';

describe('NationalIdUploadComponent', () => {
  let component: NationalIdUploadComponent;
  let fixture: ComponentFixture<NationalIdUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NationalIdUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NationalIdUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
