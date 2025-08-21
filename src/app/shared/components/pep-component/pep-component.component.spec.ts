import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PepComponentComponent } from './pep-component.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

describe('PepComponentComponent', () => {
  let component: PepComponentComponent;
  let fixture: ComponentFixture<PepComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PepComponentComponent],
      imports: [MatCardModule, FormsModule, ReactiveFormsModule, MatIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PepComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
