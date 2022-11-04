'use strict';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AccountService {

    private subject: Subject<any> = new Subject<any>();
    private _account: string;

    constructor() {
    }

    setAccount(account: any): void {
        this._account = account;
        this.subject.next(account);
    }

    getAccount(): Observable<any> {
        return this.subject.asObservable();
    }

    public getBalance(account) {

        return new Promise((resolve) => {
            if (!account) {
                resolve();
            }
            window.ethereum.eth.getBalance(account, (error, balance) => {
                if (!error) {
                    resolve(balance);
                } else {
                    console.error('Error getting balance for account: ' + account)
                }
            });
        });
    }

    public get() {
        return new Promise(async (resolve) => {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
                params: [{ eth_accounts: {} }],
            });
            resolve(accounts[0]);
        });
    }
}
