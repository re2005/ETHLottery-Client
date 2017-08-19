import { TestBed, inject } from '@angular/core/testing';

import { BetsService } from './bets.service';

describe('BetsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BetsService]
    });
  });

  it('should be created', inject([BetsService], (service: BetsService) => {
    expect(service).toBeTruthy();
  }));
});
