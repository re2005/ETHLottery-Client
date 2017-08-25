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

    public getNetworkIdSync() {
        return this.netId;
    };

    public getNetworkId() {
        return new Promise((resolve) => {
            if (typeof window.web3 !== 'undefined') {
                window.web3.version.getNetwork((err, netId) => {
                    if (!err) {
                        console.log(netId);
                        this.netId = netId;
                        resolve(netId);
                    }
                });
            }
        });
    }


    startConnection() {
        return new Promise((resolve) => {
            if (typeof window.web3 !== 'undefined') {
                window.web3 = new window.Web3(window.web3.currentProvider);
                console.warn('You are connected to MetaMask');
                this.getNetworkId();
                resolve({server: 'MetaMask', isConnected: true});
            } else {
                resolve({server: 'MetaMask', isConnected: false});
            }
        });
    }
}
