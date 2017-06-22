'use strict';
import {Injectable} from '@angular/core';
import web3 from 'web3';

@Injectable()
export class GethConnectService {

    constructor() {
    }

    startConnection() {
        const promise = new Promise((resolve) => {
            if (typeof window.web3 !== 'undefined') {
                window.web3 = new window.Web3(window.web3.currentProvider);
                resolve({server: 'MetaMask', connection: true});
                console.warn('You are connected to MetaMask');
            } else {
                window.web3 = new web3(new web3.providers.HttpProvider('http://localhost:8545'));
                const _isConnected = window.web3.isConnected();
                if (window.web3 && _isConnected) {
                    resolve({server: 'localhost', connection: true});
                    console.warn('You are connected to Localhost');
                } else {
                    resolve({server: 'localhost', connection: false});
                }
            }
        });
        return promise;
    }
}


declare global {
    interface Window { Web3: any,web3: any
    }
}
