import { TestBed, inject } from '@angular/core/testing';

import { IconGeneratorService } from './icon-generator.service';

describe('IconGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IconGeneratorService]
    });
  });

  it('should be created', inject([IconGeneratorService], (service: IconGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
