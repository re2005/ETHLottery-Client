import { TestBed, inject } from '@angular/core/testing';

import { GethContractManagerService } from './geth-contract-manager.service';

describe('GethContractManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GethContractManagerService]
    });
  });

  it('should be created', inject([GethContractManagerService], (service: GethContractManagerService) => {
    expect(service).toBeTruthy();
  }));
});
