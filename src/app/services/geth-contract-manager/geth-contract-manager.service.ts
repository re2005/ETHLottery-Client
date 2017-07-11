import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment'
import {contracts} from './contracts';

@Injectable()
export class GethContractManagerService {

    contractsUrl = environment.apiUrl;

    constructor(private http: Http) {
    }

    getCurrentContract() {
        return contracts.apiData;
        // return this.http.get(this.contractsUrl);
    }
}
