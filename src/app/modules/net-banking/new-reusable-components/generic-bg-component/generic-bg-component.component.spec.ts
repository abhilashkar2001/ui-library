import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericBgComponentComponent } from './generic-bg-component.component';

describe('GenericBgComponentComponent', () => {
  let component: GenericBgComponentComponent;
  let fixture: ComponentFixture<GenericBgComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericBgComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericBgComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
