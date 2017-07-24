'use strict';
import {Injectable} from '@angular/core';

@Injectable()
export class AccountService {

    constructor() {
    }

    public getBalance(account) {

        return new Promise((resolve) => {
            if (!account) {
                resolve();
            }
            window.web3.eth.getBalance(account, (error, balance) => {
                if (!error) {
                    resolve(balance);
                } else {
                    console.error('Error getting balance for account: ' + account)
                }
            });
        });
    }

    public get() {
        return new Promise((resolve) => {
            window.web3.eth.getAccounts((error, accounts) => {
                if (!error) {
                    resolve(accounts[0]);
                }
            });
        });
    }
}
