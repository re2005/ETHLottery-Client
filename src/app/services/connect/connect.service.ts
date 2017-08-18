'use strict';
import {Injectable} from '@angular/core';

@Injectable()
export class ConnectService {

    constructor() {
    }

    public isWeb3Connected() {
        return window.web3.isConnected();
    }

    startConnection() {
        return new Promise((resolve) => {
            if (typeof window.web3 !== 'undefined') {
                window.web3 = new window.Web3(window.web3.currentProvider);
                console.warn('You are connected to MetaMask');
                resolve({server: 'MetaMask', isConnected: true});
            } else {
                resolve({server: 'MetaMask', isConnected: false});
            }
        });
    }
}
