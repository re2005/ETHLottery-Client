'use strict';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {ApiStateInterface} from './api-state';

@Injectable()
export class ApiStateService {

    private apiState: ApiStateInterface;
    private subject: Subject<ApiStateInterface> = new Subject<ApiStateInterface>();

    constructor() {
    }

    setIsApiLoaded(apiState: ApiStateInterface): void {
        this.apiState = apiState;
        this.subject.next(apiState);
    }

    getIsApiLoaded(): Observable<ApiStateInterface> {
        return this.subject.asObservable();
    }
}
