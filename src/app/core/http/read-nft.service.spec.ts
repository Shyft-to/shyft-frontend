import { TestBed } from '@angular/core/testing';

import { ReadNftService } from './read-nft.service';

describe('ReadNftService', () => {
  let service: ReadNftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReadNftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
