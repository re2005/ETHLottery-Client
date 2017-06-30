import {Component, OnInit} from '@angular/core';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';
import {GethContractManagerService} from './services/geth-contract-manager/geth-contract-manager.service';
import {Connected} from './services/geth-connect/connected';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public isWeb3Connected: Connected;
    public isAppLoaded = false;
    private _contract: any;
    public currentNodeConnection: string;
    public retryConnect = 0;


    /**
     *
     * @param gethConnectService
     * @param gethContractService
     * @param gethContractManagerService
     */
    constructor(private gethConnectService: GethConnectService,
                private gethContractService: GethContractService,
                private gethContractManagerService: GethContractManagerService) {
    }

    getAccounts() {
        window.web3.eth.getAccounts((err, accounts) => {
            if (!err) {
                console.log(accounts);
            }
        });
    }

    loadApp(data) {
        this.isAppLoaded = data.connection;
        this.currentNodeConnection = data.server;
    }

    keepAlive() {
        setInterval(() => {
            this.isWeb3Connected = this.gethConnectService.isConnected();
            this.gethConnectService.setConnected(this.isWeb3Connected);
            // TODO Check how to keep MetaMask connection alive;
        }, 1000);
    }

    tryReconnect() {
        setTimeout(() => {
            this.retryConnect++;
            this.gethConnectService.startConnection().then((data) => this.updateConnectionStatus(data));
        }, 2000);
    }

    updateConnectionStatus(data) {
        if (data.connection) {
            this.loadApp(data);
            this.keepAlive();
        } else {
            this.tryReconnect();
        }
    }

    ngOnInit() {
        this.gethConnectService.startConnection().then((data) => this.updateConnectionStatus(data));
    }
}

declare global {
    interface Window { Web3: any,web3: any
    }
}
