import {Component, OnInit} from '@angular/core';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {AccountService} from './services/account/account.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';
import {PlayService} from './services/play/play.service';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public withdrawMessage: any;
    public bets: Array<any>;
    public isWeb3Connected: any;
    public retryConnect = 0;
    public contracts: any;
    public isPlay: boolean;
    public playContractObject: any;
    private _account: any;

    /**
     *
     * @param {GethConnectService} connectService
     * @param {GethContractService} contractService
     * @param {AccountService} accountService
     * @param {PlayService} _playService
     */
    constructor(private connectService: GethConnectService,
                private contractService: GethContractService,
                private accountService: AccountService,
                private _playService: PlayService) {
    }


    public withdraw(bet) {
        const gas = 1400000;
        const _playContractObject = this.getContractForAddress(bet.contractAddress);

        _playContractObject.withdraw({from: this._account, gas: gas}, (error, withdraw) => {
            if (!error) {
                bet.withdrawHash = withdraw;
                console.log(withdraw);
                this._playService.updateBets(this._account, this.bets);
            } else {
                console.log(error);
                this.withdrawMessage = error;
            }
        });
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

    /**
     *
     * @param address
     * @return {Object<any>}
     */
    private getContractForAddress(address) {
        let playContract;
        this.contracts.forEach(contract => {
            if (contract.address === address) {
                playContract = contract;
            }
        });
        return playContract;
    }

    private _parseBets(event) {
        return new Promise((resolve) => {
            this.bets.forEach(bet => {
                if (bet.contractAddress && event.address && bet.transactionHash && event.transactionHash) {
                    const isSameAddress = bet.contractAddress.toLowerCase() === event.address.toLowerCase();
                    const isSameTransactionHash = bet.transactionHash.toLowerCase() === event.transactionHash.toLowerCase();
                    const isConfirmed = (isSameAddress && isSameTransactionHash);
                    if (isConfirmed) {
                        bet.isConfirmed = isConfirmed;
                    }
                    if (isSameAddress) {
                        bet.isWinner = ((bet.bet === event.args.result) && bet.isConfirmed);
                    }
                }
            });
            resolve(this.bets);
        });
    }

    private _updateBets(event) {
        if (!this.bets) {
            return;
        }
        this._parseBets(event).then((bets) => {
            this._playService.updateBets(this._account, bets);
        });
    }

    private updateContractAllEvents(event) {

        this._updateBets(event);

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

    private keepAlive() {
        setInterval(() => {
        }, 1000);
    }

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

                // TODO Magically without this nothing works
                this.keepAlive();
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
