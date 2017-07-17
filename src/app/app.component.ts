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
    public contracts: any;
    public isPlay: boolean;
    public playContract: any;
    public isBetValid: any;
    public lotteryMessage: any;

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


    public lottery() {
        this.playContract.lottery((error, lottery) => {
            if (!error) {
                this.lotteryMessage = lottery;
            } else {
                this.lotteryMessage = error;
            }
        });
    }

    public playContract() {
        const bet1 = 'a';
        const bet2 = 'a';
        const gas = 4476768;
        //21000

        // if (bet1 === '$' || bet2 === '$') {
        //     this.isBetValid = true;
        //     return;
        // }
        const _bet = bet1 + bet2;
        const account = this.accountService.getAccount();
        // this.isBetValid = false;

        this.playContract.play(_bet, {
            from: account,
            value: this.playContract.contractData.fee,
            gas: gas
        }, (error, result) => {
            if (error) {
                console.log(error);
                // this.playErrorMessage = this.onPlayError(error);
            } else {
                console.log(result);
                // this.onPlaySuccess(result, _bet);
            }
        });
    }

    public play(address) {
        this.isPlay = true;
        this.playContract = this.getContractForAddress(address);
    }


    public refreshList() {
        delete this.contracts;
        this._loadApp();
    }

    private setContractForAddress(address, newContract) {
        this.contracts.forEach(contract => {
            if (contract.address === address) {
                contract = newContract;
            }
        });
    }

    private getContractForAddress(address) {
        let playContract = {};
        this.contracts.forEach(contract => {
            if (contract.address === address) {
                playContract = contract;
            }
        });
        return playContract;
    }

    private updateContractAllEvents(event) {

        this.contracts.forEach(contract => {

            if (!contract.contractEvents) {
                contract.contractEvents = [];
            }
            if (event.address.toLowerCase() === contract.address.toLowerCase()) {
                contract.contractEvents.push(event);
                if (event.event === 'Total') {
                    contract.contractData.total = event.args.total;
                }
                if (event.event === 'Open') {
                    contract.contractData.open = event.args.open;
                }
                if (event.event === 'Result') {
                    contract.contractData.result = event.args.result;
                }
            }
        })
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

    private _loadApp() {
        this.contractService.getContracts().then((contracts) => {
            this.contracts = contracts;
            this.apiStateService.setIsApiLoaded({isLoaded: true});
            this._setListeners(contracts).then((listeners) => {
                this._triggerListeners(listeners);
            });
        })
    }

    private keepAlive() {
        setInterval(() => {
            this.isWeb3Connected = this.connectService.isWeb3Connected();
            this.connectService.setConnected(this.isWeb3Connected);
        }, 2000);
    }

    private tryReconnect() {
        setTimeout(() => {
            this.retryConnect++;
            this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        }, 5000);
    }

    private updateConnectionStatus(data) {
        if (data.isConnected) {
            this._loadApp();
            this.keepAlive();
        } else {
            this.tryReconnect();
        }
    }

    private onGetIsApiLoadedWasChanged(apiState) {
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

        this.contractService.getContractsObservable().subscribe(data => {
            if (data === undefined) {
                return false;
            }
            this.setContractForAddress(data.address, data);
        });

    }
}
