import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNftPageComponent } from './list-nft-page.component';

describe('ListNftPageComponent', () => {
  let component: ListNftPageComponent;
  let fixture: ComponentFixture<ListNftPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNftPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListNftPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
