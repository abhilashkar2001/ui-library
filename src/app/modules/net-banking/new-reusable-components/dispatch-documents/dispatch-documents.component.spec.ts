import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchDocumentsComponent } from './dispatch-documents.component';

describe('DispatchDocumentsComponent', () => {
  let component: DispatchDocumentsComponent;
  let fixture: ComponentFixture<DispatchDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DispatchDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
