import {Component, OnInit, ElementRef} from '@angular/core';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {AccountService} from './services/account/account.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';
import {PlayService} from './services/play/play.service';
import _ from 'lodash';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public bets: Array<any>;
    public isWeb3Connected: any;
    public retryConnect = 0;
    public contracts: any;
    public isPlay: boolean;
    public playContractObject: any;
    public lotteryMessage: any;
    private _account: any;

    /**
     *
     * @param {GethConnectService} connectService
     * @param {GethContractService} contractService
     * @param {ElementRef} elementRef
     * @param {AccountService} accountService
     * @param {PlayService} _playService
     */
    constructor(private connectService: GethConnectService,
                private contractService: GethContractService,
                private elementRef: ElementRef,
                private accountService: AccountService,
                private _playService: PlayService) {
    }

    public withdraw() {
        const account = this.accountService.getAccount();
        const gas = 14000000;
        this.playContractObject.withdraw({from: account, gas: gas}, (error, withdraw) => {
            if (!error) {
                console.log(withdraw);
                // this.withdrawMessage = withdraw;
            } else {
                console.log(error);
                // this.withdrawMessage = error;
            }
        })
    }

    // public lottery() {
    //     this.playContractObject.lottery((error, lottery) => {
    //         if (!error) {
    //             this.lotteryMessage = lottery;
    //         } else {
    //             this.lotteryMessage = error;
    //         }
    //     });
    // }


    public closePlay() {
        this.isPlay = false;
        delete this.playContractObject;
    }

    public play(address, index) {
        this.isPlay = true;
        this.playContractObject = this.getContractForAddress(address);
        this.playContractObject.account = this._account;
        this.playContractObject._index = index;
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

    private setElementUpdated(address, updateType) {
        // setTimeout(() => {
        //     // console.log(_element, updateType);
        // }, 5000);
    }

    private _parseBets(event) {
        let localBets = _.clone(this.bets);
        return new Promise((resolve) => {
            let isConfirmed;
            localBets.forEach(bet => {
                if (bet.isConfirmed) return;
                isConfirmed = (bet.contractAddress.toLowerCase() === event.address.toLowerCase()) && (bet.txResult === event.transactionHash);
                bet.isConfirmed = isConfirmed;
            });
            resolve(localBets);
        });
    }

    private _updateBets(event) {
        if (!this.bets) return;
        this._parseBets(event).then((bets) => {
            this._playService.updateBets(this._account, bets);
        });
    }

    private updateContractAllEvents(event) {

        if (event.event === 'Total') {
            this._updateBets(event);
        }

        this.contracts.forEach(contract => {
            if (!contract.contractEvents) {
                contract.contractEvents = [];
            }
            if (event.address.toLowerCase() === contract.address.toLowerCase()) {

                contract.contractEvents.push(event);
                this.setElementUpdated(contract.address.toLowerCase(), event.event);

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
        });
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
        this.contractService.get().then((contracts) => {
            this.contracts = contracts;
            this._setListeners(contracts).then((listeners) => {
                this._triggerListeners(listeners);
            });
        });
    }

    // private keepAlive() {
    //     setInterval(() => {
    //         this.isWeb3Connected = this.connectService.isWeb3Connected();
    //         this.connectService.setConnected(this.isWeb3Connected);
    //     }, 2000);
    // }

    private tryReconnect() {
        setTimeout(() => {
            this.retryConnect++;
            this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        }, 5000);
    }

    private updateConnectionStatus(data) {
        if (data.isConnected && this.connectService.isWeb3Connected()) {

            this.accountService.getAccountPromise().then(account => {
                if (!account) {
                    alert('Please unlock your account on META MASK and refresh the page');
                }
                this._loadApp();
                this._account = account;
                this._loadBets();
            });

            // TODO this is just to show loading screen
            setTimeout(() => {
                this.isWeb3Connected = this.connectService.isWeb3Connected();
            }, 1200);

        } else {
            this.tryReconnect();
        }
    }

    private _loadBets() {
        this._playService.getBets(this._account).then(bets => {
            this.bets = bets;
        });
    }

    private _onBetsWasChanged() {
        this._loadBets();
    }

    onKey(data) {
        if (data.key === 'Escape') {
            this.isPlay = false;
            delete this.playContractObject;
        }
    }

    ngOnInit() {
        this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));

        this._playService.listenBetsWasChange().subscribe(() => {
            this._onBetsWasChanged();
        });
    }
}

declare global {
    interface Window {
        Web3: any,
        web3: any
    }
}
