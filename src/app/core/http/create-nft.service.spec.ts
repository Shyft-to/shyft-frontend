import { TestBed } from '@angular/core/testing';

import { CreateNftService } from './create-nft.service';

describe('CreateNftService', () => {
  let service: CreateNftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateNftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
