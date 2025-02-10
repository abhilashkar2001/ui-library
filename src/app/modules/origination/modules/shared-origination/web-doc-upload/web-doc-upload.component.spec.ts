import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebDocUploadComponent } from './web-doc-upload.component';

describe('WebDocUploadComponent', () => {
  let component: WebDocUploadComponent;
  let fixture: ComponentFixture<WebDocUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebDocUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebDocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
