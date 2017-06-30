import {Injectable} from '@angular/core';

@Injectable()
export class GethContractManagerService {

    private _contracts = [
        '0x19e75b7760b1b8e708c085ab83ab7b62db126578',
        '0x19e75b7760b1b8e708c085ab83ab7b62db126577',
        '0x19e75b7760b1b8e708c085ab83ab7b62db126576'
    ];

    constructor() {
    }

    getCurrentContract() {
        return this._contracts;
    }
}
