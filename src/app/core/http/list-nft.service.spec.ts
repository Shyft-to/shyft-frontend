import { TestBed } from '@angular/core/testing';

import { ListNftService } from './list-nft.service';

describe('ListNftService', () => {
  let service: ListNftService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListNftService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
