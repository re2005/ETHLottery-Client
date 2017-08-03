import {Injectable} from '@angular/core';
import {contracts} from './contracts';

@Injectable()
export class ContractManagerService {


    constructor() {
    }

    getCurrentContract() {
        return contracts.apiData;
    }
}
