import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolanaCreateNftPageComponent } from './solana-create-nft-page.component';

describe('SolanaCreateNftPageComponent', () => {
  let component: SolanaCreateNftPageComponent;
  let fixture: ComponentFixture<SolanaCreateNftPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolanaCreateNftPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolanaCreateNftPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
