'use strict';
import {Injectable} from '@angular/core';

@Injectable()
export class AccountService {

    private account: string;

    constructor() {
    }


    getAccount() {
        return this.account;
    }

    public getAccountPromise() {
        return new Promise((resolve) => {
            window.web3.eth.getAccounts((error, accounts) => {
                if (!error) {
                    resolve(accounts[0]);
                }
            });
        });
    }
}
