import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DarkFooterComponent } from './dark-footer.component';

describe('DarkFooterComponent', () => {
  let component: DarkFooterComponent;
  let fixture: ComponentFixture<DarkFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DarkFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
