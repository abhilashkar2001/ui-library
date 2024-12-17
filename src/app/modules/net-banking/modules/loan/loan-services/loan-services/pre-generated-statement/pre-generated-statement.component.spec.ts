import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGeneratedStatementComponent } from './pre-generated-statement.component';

describe('PreGeneratedStatementComponent', () => {
  let component: PreGeneratedStatementComponent;
  let fixture: ComponentFixture<PreGeneratedStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreGeneratedStatementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PreGeneratedStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
