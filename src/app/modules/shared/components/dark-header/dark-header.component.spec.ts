import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkHeaderComponent } from './dark-header.component';

describe('DarkHeaderComponent', () => {
  let component: DarkHeaderComponent;
  let fixture: ComponentFixture<DarkHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarkHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
