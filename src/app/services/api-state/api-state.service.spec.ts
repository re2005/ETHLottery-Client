import {TestBed, inject} from '@angular/core/testing';

import {ApiStateService} from './api-state.service';

describe('ApiStateService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ApiStateService]
        });
    });

    it('should be created', inject([ApiStateService], (service: ApiStateService) => {
        expect(service).toBeTruthy();
    }));
});
