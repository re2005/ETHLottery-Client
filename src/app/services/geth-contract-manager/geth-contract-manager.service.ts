import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment'

@Injectable()
export class GethContractManagerService {

    contractsUrl = environment.apiUrl;

    constructor(private http: Http) {
    }

    getCurrentContract() {
        return this.http.get(this.contractsUrl);
    }
}
