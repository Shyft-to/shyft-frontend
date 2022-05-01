import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetApiPageComponent } from './get-api-page.component';

describe('GetApiPageComponent', () => {
  let component: GetApiPageComponent;
  let fixture: ComponentFixture<GetApiPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetApiPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetApiPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
