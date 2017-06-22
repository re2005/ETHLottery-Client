import { TestBed, inject } from '@angular/core/testing';

import { GethContractService } from './geth-contract.service';

describe('GethContractService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GethContractService]
    });
  });

  it('should be created', inject([GethContractService], (service: GethContractService) => {
    expect(service).toBeTruthy();
  }));
});
