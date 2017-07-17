import { TestBed, inject } from '@angular/core/testing';

import { PlayService } from './play.service';

describe('PlayService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayService]
    });
  });

  it('should be created', inject([PlayService], (service: PlayService) => {
    expect(service).toBeTruthy();
  }));
});
