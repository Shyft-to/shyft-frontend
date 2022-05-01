import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessToNftComponent } from './access-to-nft.component';

describe('AccessToNftComponent', () => {
  let component: AccessToNftComponent;
  let fixture: ComponentFixture<AccessToNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessToNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessToNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
