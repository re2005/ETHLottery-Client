'use strict';
import {Injectable} from '@angular/core';
import web3 from 'web3';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Connected} from './connected';


@Injectable()
export class GethConnectService {

    private connected: Connected;
    private subject: Subject<Connected> = new Subject<Connected>();

    constructor() {
    }

    setConnected(connected: Connected): void {
        this.connected = connected;
        this.subject.next(connected);
    }

    getConnected(): Observable<Connected> {
        return this.subject.asObservable();
    }

    isConnected() {
        return window.web3.isConnected();
    }

    startConnection() {
        return new Promise((resolve) => {
            if (typeof window.web3 !== 'undefined' && window.web3.currentProvider.host !== 'http://localhost:8545') {
                window.web3 = new window.Web3(window.web3.currentProvider);
                console.warn('You are connected to MetaMask');
                resolve({server: 'MetaMask', isConnected: true});
            } else {
                window.web3 = new web3(new web3.providers.HttpProvider('http://localhost:8545'));
                if (window.web3 && this.isConnected()) {
                    resolve({server: 'localhost', isConnected: true});
                    console.warn('You are connected to localhost');
                } else {
                    resolve({server: 'localhost', isConnected: false});
                }
            }
        });
    }
}
