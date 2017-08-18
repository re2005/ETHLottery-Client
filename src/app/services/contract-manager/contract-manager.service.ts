import {Injectable} from '@angular/core';
import {abiManager} from './abi-manager';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ContractManagerService {

    private _event: Subject<any> = new Subject<any>();
    private managerAddress = '0x7Cf11C347dC959191cC17ab744984b60E9A85a7c';
    private managerData: any;

    constructor() {
    }

    private broadcastEvent(event): void {
        this._event.next(event);
    }

    public listenEvent(): Observable<any> {
        return this._event.asObservable();
    }

    public setListeners() {
        if (!this.managerData) {
            this.makeManagerObject();
        }

        window.web3.eth.getBlockNumber((e, result) => {
            const block = result - 10000;
            this.managerData.Register({fromBlock: block, toBlock: 'latest'}).watch((error, event) => {
                this.broadcastEvent(event);
            });
        });
    }

    public getOwner() {
        if (!this.managerData) {
            this.makeManagerObject();
        }
        return new Promise(resolve => {
            this.managerData.owner((error, owner) => {
                resolve(owner);
            });
        });
    }

    private makeManagerObject() {
        this.managerData = this._getContractForAddress(this.managerAddress);
    }

    /**
     *
     * @param {String} contractAddress
     */
    private _getContractForAddress(contractAddress) {
        return window.web3.eth.contract(abiManager).at(contractAddress);
    }


    private getLotteries() {
        return new Promise(resolve => {
            this.managerData.lotteries((error, lotteries) => {
                resolve(lotteries);
            });
        });
    }

    /**
     *
     * @return {Promise<Array>}
     */
    private generateContractsList() {
        return new Promise(resolve => {
            this.makeManagerObject();
            this.getLotteries().then(lotteries => {
                resolve(lotteries);
            });
        });
    }

    public getCurrentContracts() {
        return this.generateContractsList();
    }
}
