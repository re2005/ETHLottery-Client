import {Injectable} from '@angular/core';
import {abiManager} from './abi-manager';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ContractManagerService {

    private _event: Subject<any> = new Subject<any>();
    private managerAddress = '0x32B28c99c3afB1fBb56a32074ac92505bbBE0a5B';
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
        this.managerData.Register().watch((error, event) => {
            if (!error) {
                this.broadcastEvent(event);
            }
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
        const manager = window.web3.eth.contract(abiManager);
        return manager.at(contractAddress);
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
