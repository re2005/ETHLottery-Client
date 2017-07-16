'use strict';
import {Injectable} from '@angular/core';
import {AccountInterface} from './account';

@Injectable()
export class AccountService {

    private account: AccountInterface;

    constructor() {
    }

    setAccount(account: AccountInterface) {
        this.account = account;
    }

    getAccount() {
        return this.account;
    }

    setDefaultAccount() {
        window.web3.eth.getAccounts((error, accounts) => {
            if (!error) {
                this.setAccount(accounts[0]);
                if (accounts.length === 0) {
                    alert('Please unlock your account on META MASK and refresh this page');
                }
            }
        });
    }
}
