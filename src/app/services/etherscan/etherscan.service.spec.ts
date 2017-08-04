import { TestBed, inject } from '@angular/core/testing';

import { EtherscanService } from './etherscan.service';

describe('EtherscanService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EtherscanService]
    });
  });

  it('should be created', inject([EtherscanService], (service: EtherscanService) => {
    expect(service).toBeTruthy();
  }));
});
