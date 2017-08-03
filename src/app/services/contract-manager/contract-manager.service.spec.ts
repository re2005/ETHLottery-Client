import { TestBed, inject } from '@angular/core/testing';

import { ContractManagerService } from './contract-manager.service';

describe('ContractManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractManagerService]
    });
  });

  it('should be created', inject([ContractManagerService], (service: ContractManagerService) => {
    expect(service).toBeTruthy();
  }));
});
