import {Component, OnInit} from '@angular/core';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {Connected} from './services/geth-connect/connected';
import {ApiStateService} from './services/api-state/api-state.service';
import {AccountService} from './services/account/account.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public isWeb3Connected: Connected;
    public isAppLoaded = false;
    public retryConnect = 0;

    /**
     *
     * @param {GethConnectService} connectService
     * @param {GethContractService} contractService
     * @param {ApiStateService} apiStateService
     * @param {AccountService} accountService
     */
    constructor(private connectService: GethConnectService,
                private contractService: GethContractService,
                private apiStateService: ApiStateService,
                private accountService: AccountService) {
    }


    private updateContractAllEvents(event) {
        this.contractService.setEvent(event);
    }

    private _triggerListeners(eventListeners) {
        const that = this;
        eventListeners.forEach(allEvents => {
            allEvents.watch(function (error, event) {
                that.updateContractAllEvents(event);
            });
        });
    }

    private _setListeners(contracts) {
        const eventListeners = [];
        return new Promise((resolve) => {
            window.web3.eth.getBlockNumber(function (e, result) {
                const block = result - 100000;
                contracts.forEach(contract => {
                    const allEvents = contract.allEvents({fromBlock: block, toBlock: 'latest'});
                    eventListeners.push(allEvents);
                });
                resolve(eventListeners);
            });
        });
    }

    loadApp(data) {
        this.contractService.getContracts().then((contracts) => {
            this._setListeners(contracts).then((listeners) => {
                this._triggerListeners(listeners);
            });
        })
    }

    keepAlive() {
        setInterval(() => {
            this.isWeb3Connected = this.connectService.isWeb3Connected();
            this.connectService.setConnected(this.isWeb3Connected);
        }, 2000);
    }

    tryReconnect() {
        setTimeout(() => {
            this.retryConnect++;
            this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        }, 5000);
    }

    updateConnectionStatus(data) {
        if (data.isConnected) {
            this.loadApp(data);
            this.keepAlive();
        } else {
            this.tryReconnect();
        }
    }

    onGetIsApiLoadedWasChanged(apiState) {
        this.isAppLoaded = apiState.isLoaded;
        if (apiState) {
            this.retryConnect = 0;
        }
    }

    ngOnInit() {
        this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        this.apiStateService.setIsApiLoaded({isLoaded: false});
        this.apiStateService.getIsApiLoaded().subscribe(apiState => {
            this.onGetIsApiLoadedWasChanged(apiState);
        });

        this.accountService.setDefaultAccount();

    }
}
