import { TestBed, inject } from '@angular/core/testing';

import { GethConnectService } from './geth-connect.service';

describe('GethConnectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GethConnectService]
    });
  });

  it('should be created', inject([GethConnectService], (service: GethConnectService) => {
    expect(service).toBeTruthy();
  }));
});
