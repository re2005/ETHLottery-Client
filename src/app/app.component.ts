import _ from 'lodash';
import {Component, OnInit} from '@angular/core';
import {PlayService} from './services/play/play.service';
import {StorageService} from './services/storage/storage.service';
import {ConnectService} from './services/connect/connect.service';
import {AccountService} from './services/account/account.service';
import {ContractService} from './services/contract/contract.service';
import {EtherscanService} from './services/etherscan/etherscan.service';
import {ContractManagerService} from './services/contract-manager/contract-manager.service'

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public withdrawMessage: string;
    public bets: Object;
    public isWeb3Connected: any;
    public retryConnect = 0;
    public contracts: any;
    public isPlay: boolean;
    public playContractObject: any;
    public account: any;
    private _network: string;
    public isOnwer = false;

    /**
     *
     * @param {ConnectService} connectService
     * @param {ContractService} contractService
     * @param {AccountService} _accountService
     * @param {PlayService} _playService
     * @param {StorageService} _storageService
     * @param {EtherscanService} _etherscanService
     * @param {ContractManagerService} _contractManagerService
     */
    constructor(private connectService: ConnectService,
                private _contractService: ContractService,
                private _accountService: AccountService,
                private _playService: PlayService,
                private _storageService: StorageService,
                private _etherscanService: EtherscanService,
                private _contractManagerService: ContractManagerService) {
    }

    public howToPlay() {
        this._storageService.remove('tutorial');
        window.location.reload();

        window.ga('send', {
            hitType: 'event',
            eventCategory: 'Site',
            eventAction: 'How to play',
            eventLabel: 'Open'
        });
    }

    public withdraw(bet) {
        const gas = 1400000;
        const _playContractObject = this.getContractForAddress(bet.contractAddress);

        _playContractObject.withdraw({from: this.account.address, gas: gas}, (error, withdraw) => {
            if (!error) {
                bet.withdrawHash = withdraw;
                this._playService.updateBets(this.account.address, this.bets);
            } else {
                this.withdrawMessage = error;
            }
        });
    }

    public closePlay() {
        this.isPlay = false;

        window.ga('send', {
            hitType: 'event',
            eventCategory: this.playContractObject.address,
            eventAction: 'Close play',
            eventLabel: 'close-play'
        });

        delete this.playContractObject;
    }

    public play(address) {

        window.ga('send', {
            hitType: 'event',
            eventCategory: address,
            eventAction: 'Open play',
            eventLabel: 'open-play'
        });

        this.playContractObject = this.getContractForAddress(address);
        if (this.playContractObject.contractData.open) {
            this.isPlay = true;
            this.playContractObject.account = this.account.address;
            return
        }
        this.openAddress(address);
        delete this.playContractObject;
    }

    /**
     *
     * @param address
     */
    public openAddress(address) {
        this._etherscanService.openAddress(address);
    }

    /**
     *
     * @param address
     */
    public openTx(address) {
        this._etherscanService.openTx(address);
    }

    /**
     *
     * @param address
     * @return {Object<any>}
     */
    private getContractForAddress(address) {
        return this.contracts[address];
    }


    private _parseBets(event) {
        let shouldUpdate = false;
        let bet;
        return new Promise((resolve) => {

            if (!_.isUndefined(this.bets[event.address])) {
                bet = this.bets[event.address][event.args._byte];
            }

            if (bet) {
                if (!bet.isConfirmed) {
                    bet.isConfirmed = bet.transactionHash === event.transactionHash;
                    shouldUpdate = bet.isConfirmed;
                    this._updateBalance(this.account.address);
                }
            }

            // this.bets.forEach(bet => {
            //     const isSameAddress = bet.contractAddress.toLowerCase() === event.address.toLowerCase();
            //     if (isSameAddress) {
            //         const isSameTransactionHash = bet.transactionHash.toLowerCase() === event.transactionHash.toLowerCase();
            //         const isConfirmed = (isSameAddress && isSameTransactionHash);
            //         if (isConfirmed && !bet.isConfirmed) {
            //             bet.isConfirmed = isConfirmed;
            //             const audio = new Audio('../assets/audio/play-success.mp3');
            //             audio.play();
            //             shouldUpdate = true;
            //         }
            //         if (event.event === 'Result' && bet.isConfirmed) {
            //             bet.isWinner = ((bet.bet === event.args._result) === bet.isConfirmed);
            //             shouldUpdate = true;
            //         }
            //         if (!this.isContractOpen(bet.contractAddress) && !isConfirmed) {
            //             bet.isInvalid = true;
            //             shouldUpdate = true;
            //         }
            //     }
            // });

            if (shouldUpdate) {
                const audio = new Audio('../assets/audio/play-success.mp3');
                audio.play();
                resolve(this.bets);
            } else {
                resolve(false);
            }
        });
    }

    private _updateBets(event) {
        this._parseBets(event).then((bets) => {
            if (bets) {
                this._playService.updateBets(this.account.address, bets);
            }
        });
    }

    private calculateScale(total, jackpot) {
        const size = total ? 1 * total / jackpot : 0;
        const scale = 1 + size;
        return 'scale(' + scale + ')';
    }


    private getResultHash(contract) {
        return new Promise((resolve, reject) => {
            contract.result_hash((error, resultHash) => {
                if (error) {
                    reject(error);
                }
                resolve(resultHash);
            });
        });
    }

    public calculateCurrentBets(balance, fee) {
        return Math.floor(balance / fee);
    }

    public calculateTotalBets(jackpot, fee) {
        return Math.ceil(jackpot / fee);
    }

    private updateContractAllEvents(event) {

        if (!event) {
            return;
        }

        const _contract = this.contracts[event.address];

        switch (event.event) {
            case 'Open':
                _contract.contractData.open = event.args._open;
                if (!event.args._open) {
                    _contract.contractData.resultBlock = event.blockNumber + 10;
                }
                // TODO check the bets to cancel when it's pending and Open is = false
                break;
            case 'Play':
                console.log('Play: ', event.args._time, event.args._byte);
                if (event.args._sender === this.account.address && this.bets) {
                    this._updateBets(event);
                }
                break;
            case 'Balance':
                _contract.contractData.balance =
                    event.args._balance;
                _contract.contractData.scale =
                    this.calculateScale(event.args._balance, _contract.contractData.jackpot);
                break;
            case 'Result':
                _contract.contractData.result = event.args._result;

                this.getResultHash(_contract).then(resultHash => {
                    _contract.contractData.resultHash = resultHash;
                });
                this._updateBets(event);
                // TODO check the bets
                break;
            case 'Withdraw':
                console.log('Withdraw: ', event.args._amount);
                break;
            case 'Accumulate':
                _contract.allEvents.stopWatching();
                break;
            case 'Destroy':
                _contract.allEvents.stopWatching();
                break;
        }


        // this.contracts.forEach(contract => {
        //
        //     if (event.address.toLowerCase() === contract.address.toLowerCase()) {
        //
        //         if (event.event === 'Balance') {
        //             contract.contractData.balance = event.args._balance;
        //             contract.contractData.scale = this.calculateScale(event.args._balance, contract.contractData.jackpot);
        //         }
        //         if (event.event === 'Open') {
        //             contract.contractData.open = event.args._open;
        //             if (!contract.contractData.open) {
        //                 contract.contractData.resultBlock = event.blockNumber + 10;
        //             }
        //         }
        //         if (event.event === 'Result') {
        //             contract.contractData.result = event.args._result;
        //             this.getResultHash(contract).then(resultHash => {
        //                 contract.contractData.resultHash = resultHash;
        //             })
        //         }
        //     }
        // });
    }

    private _triggerListeners(eventListeners) {
        eventListeners.forEach(allEvents => {
            allEvents.watch((error, event) => {
                this.updateContractAllEvents(event);
            });
        });
    }

    private _setListeners(contracts) {

        const eventListeners = [];
        const hash = '0x0000000000000000000000000000000000000000000000000000000000000000';

        return new Promise((resolve) => {
            window.web3.eth.getBlockNumber((e, result) => {
                const block = result - 1000;
                for (const contract in contracts) {
                    if (contracts[contract].contractData.resultHash === hash) {
                        const allEvents = contracts[contract].allEvents({
                            fromBlock: block,
                            toBlock: 'latest'
                        });
                        eventListeners.push(allEvents);
                    }
                }
                resolve(eventListeners);
            });
        });
    }


    /**
     *
     * @param account
     * @private
     */
    private _updateBalance(account) {
        this.getAccountBalance(account).then(balance => {
            this.account.balance = balance;
        });
    }

    private setAccount() {
        this.getAccount().then(account => {
            if (!account) {
                return;
            }
            this.account = {};
            this.account.address = account;
            this._accountService.setAccount(account);
            this._loadBets();
            this.getAccountBalance(account).then(balance => {
                this.account.balance = balance;
            });
        })
    }

    private getAccountBalance(account) {
        return this._accountService.getBalance(account);
    }


    public getAccount() {
        return this._accountService.get();
    }

    /**
     *
     * @param account
     * @private
     */
    private _setAccount(account) {
        this.account = {};
        this.account.address = account;
        this.getAccountBalance(account).then(balance => {
            this.account.balance = balance;
        });
    }

    private _loadBets() {
        delete this.bets;
        this._playService.getBets(this.account.address).then(bets => {
            this.bets = bets;
        });
    }

    private _onBetsWasChanged() {
        this._loadBets();
    }

    private setNetwork() {
        window.web3.version.getNetwork((err, netId) => {
            if (!err) {
                this._network = netId;
            }
        });
    }

    private listenEventsForNewContract(contract) {
        contract.allEvents().watch((error, event) => {
            this.updateContractAllEvents(event);
        });
    }

    private makeContractForAddress(address) {
        const newContract = this._contractService._getContractForAddress(address);
        this._contractService.incrementContractData(newContract).then(contract => {
            this.contracts[address] = contract;
            this.contracts = _.clone(this.contracts);

            this._contractService.setContracts(this.contracts);
            this.listenEventsForNewContract(contract);
        });
    }

    private includeContract(address) {
        this.makeContractForAddress(address);
    }

    private setManagerListener() {
        this._contractManagerService.listenEvent().subscribe(event => {
            if (!event) {
                return;
            }
            const newAddress = this.contracts[event.args._lottery];
            if (!newAddress) {
                this.includeContract(event.args._lottery);
            }
        });
    }

    private keepAlive() {
        const interval = setInterval(() => {
            if (_.isUndefined(this.account.address)) {
                this.setAccount();
            }
        }, 1000);
    }

    private tryReconnect() {
        if (this.retryConnect > 5) {
            return;
        }
        setTimeout(() => {
            this.retryConnect++;
            this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        }, 1200);
    }

    private _loadApp() {
        this.contracts = {};
        this._contractService.get().then((contracts) => {
            this.contracts = contracts;
            this._contractService.broadcastContracts(contracts);
            this._setListeners(contracts).then((listeners) => {
                this._triggerListeners(listeners);
            });
        });
    }

    private _bootstrap() {
        this.getAccount().then(account => {

            this._setAccount(account);
            this._loadApp();
            this._loadBets();
            this.setNetwork();
            this._contractManagerService.setListeners();
            this.setManagerListener();

            // Magically without this nothing works
            this.keepAlive();
        });

        // This is just to show loading screen
        setTimeout(() => {
            this.isWeb3Connected = this.connectService.isWeb3Connected();
        }, 1200);
    }

    /**
     *
     * @param {Object} data
     */
    private updateConnectionStatus(data) {
        if (data.isConnected && this.connectService.isWeb3Connected()) {
            this._bootstrap();
        } else {
            this.tryReconnect();
        }
    }


    ngOnInit() {

        this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));

        this._playService.listenBetsWasChange().subscribe(() => {
            this._onBetsWasChanged();
        });

        this._playService.listenClosePlayWindow().subscribe((isSuccess) => {
            this.closePlay();

            if (isSuccess) {
                const audio = new Audio('../assets/audio/play-done.mp3');
                audio.play();
            }
        });

        this._accountService.getAccount().subscribe((account) => {
            if (!this.account) {
                this.account = account;
            }
        });
    }
}

declare global {
    interface Window {
        Web3: any,
        web3: any,
        ga: any
    }
}
