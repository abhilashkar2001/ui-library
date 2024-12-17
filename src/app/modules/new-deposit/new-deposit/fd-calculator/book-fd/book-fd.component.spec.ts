import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFdComponent } from './book-fd.component';

describe('BookFdComponent', () => {
  let component: BookFdComponent;
  let fixture: ComponentFixture<BookFdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookFdComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookFdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
