import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {environment} from '../../../environments/environment'
import {contracts} from './contracts';

@Injectable()
export class GethContractManagerService {

    contractsUrl = environment.apiUrl;

    // private url = 'http://localhost:8000/icon.html?address=0xd1498f1c4aaafcd1eaa1b6e3594a37c7fd7d0909';

    constructor(private http: Http) {
    }


    // test() {
    //     this.getDataObservable(this.url).subscribe((data) => {
    //     });
    // }
    //
    // getDataObservable(url: string) {
    //     return this.http.get(url)
    //         .map(data => {
    //             data.json();
    //             console.log('I CAN SEE DATA HERE: ', data.json());
    //             return data.json();
    //         });
    // }

    getCurrentContract() {
        return contracts.apiData;
        // return this.http.get(this.contractsUrl);
    }
}
