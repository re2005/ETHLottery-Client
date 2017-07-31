import { TestBed, inject } from '@angular/core/testing';

import { ServerSocketService } from './server-socket.service';

describe('ServerSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServerSocketService]
    });
  });

  it('should be created', inject([ServerSocketService], (service: ServerSocketService) => {
    expect(service).toBeTruthy();
  }));
});
