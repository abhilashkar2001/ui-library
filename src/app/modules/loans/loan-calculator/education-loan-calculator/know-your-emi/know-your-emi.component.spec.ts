import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnowYourEmiComponent } from './know-your-emi.component';

describe('KnowYourEmiComponent', () => {
  let component: KnowYourEmiComponent;
  let fixture: ComponentFixture<KnowYourEmiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KnowYourEmiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnowYourEmiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
