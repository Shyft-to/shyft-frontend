import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNftPageComponent } from './create-nft-page.component';

describe('CreateNftPageComponent', () => {
  let component: CreateNftPageComponent;
  let fixture: ComponentFixture<CreateNftPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNftPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNftPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
