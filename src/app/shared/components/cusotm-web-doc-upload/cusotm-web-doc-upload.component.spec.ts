import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CusotmWebDocUploadComponent } from './cusotm-web-doc-upload.component';

describe('CusotmWebDocUploadComponent', () => {
  let component: CusotmWebDocUploadComponent;
  let fixture: ComponentFixture<CusotmWebDocUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CusotmWebDocUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CusotmWebDocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
