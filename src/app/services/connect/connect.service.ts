'use strict';
import {Injectable} from '@angular/core';

@Injectable()
export class ConnectService {

    private netId: any;

    constructor() {
    }

    public isWeb3Connected() {
        return window.web3.isConnected();
    }

    public getNetworkId() {
        return new Promise((resolve) => {
            if (typeof window.web3 !== 'undefined') {
                window.web3.version.getNetwork((err, netId) => {
                    if (!err) {
                        resolve(netId);
                    }
                });
            }
        });
    }

    public getNetworkIdSYnc() {
        return this.netId;
    }

    public getMetamask() {
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

    startConnection() {
        return Promise.all([
            this.getMetamask(),
            this.getNetworkId()
        ]).then(values => {
            this.netId = values[1];
            return {
                isConnected: values[0]['isConnected'],
                server: values[0]['server']
            };
        });
    }
}
