import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNftPageComponent } from './read-nft-page.component';

describe('ReadNftPageComponent', () => {
  let component: ReadNftPageComponent;
  let fixture: ComponentFixture<ReadNftPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadNftPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadNftPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
