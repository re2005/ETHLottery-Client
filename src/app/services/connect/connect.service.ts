'use strict';
import { Injectable } from '@angular/core';


@Injectable()
export class ConnectService {

    private netId: any;

    constructor() {
    }

    public isWeb3Connected() {
        return window.ethereum.isConnected();
    }

    public getNetworkIdSync() {
        return this.netId;
    };

    public getNetworkId() {
        return new Promise((resolve) => {
            if (typeof window.ethereum !== 'undefined') {
                this.netId = window.ethereum.networkVersion;
            }
        });
    }

    startConnection() {
        return new Promise((resolve) => {
            if (typeof window.ethereum !== 'undefined') {
                // window.ethereum = new window.ethereum(window.ethereum.currentProvider);
                console.warn('You are connected to MetaMask');
                this.getNetworkId();
                resolve({ server: 'MetaMask', isConnected: true });
            } else {
                resolve({ server: 'MetaMask', isConnected: false });
            }
        });
    }
}
