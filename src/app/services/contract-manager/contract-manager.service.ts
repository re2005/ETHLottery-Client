import {Injectable} from '@angular/core';
import {abiManager} from './abi-manager';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {ConnectService} from '../connect/connect.service';

@Injectable()
export class ContractManagerService {

    private _event: Subject<any> = new Subject<any>();
    private managerAddress = {
        test: '0x32B28c99c3afB1fBb56a32074ac92505bbBE0a5B',
        main: '0x32B28c99c3afB1fBb56a32074ac92505bbBE0a5B'
    };
    private managerData: any;

    /**
     *
     * @param {ConnectService} _connectService
     */
    constructor(private _connectService: ConnectService) {
    }

    private broadcastEvent(event): void {
        this._event.next(event);
    }

    public listenEvent(): Observable<any> {
        return this._event.asObservable();
    }

    private setListeners() {
        this.managerData.Register().watch((error, event) => {
            if (!error) {
                this.broadcastEvent(event);
            }
        });
    }

    private makeManagerAddress(network) {
        if (network === '3') {
            return this.managerAddress.test;
        } else if (network === '1') {
            return this.managerAddress.main;
        }
    }

    private makeManagerObject() {
        return new Promise(resolve => {
            this._connectService.getNetworkId().then(network => {
                const address = this.makeManagerAddress(network);
                this.managerData = this._getContractForAddress(address);
                resolve(this.managerData);
            });
        })
    }

    /**
     *
     * @param {String} contractAddress
     */
    private _getContractForAddress(contractAddress) {
        const manager = window.web3.eth.contract(abiManager);
        return manager.at(contractAddress);
    }


    private getLotteries(manager) {
        return new Promise(resolve => {
            manager.lotteries((error, lotteries) => {
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
            this.makeManagerObject().then(manager => {
                this.getLotteries(manager).then(lotteries => {
                    this.setListeners();
                    resolve(lotteries);
                });
            });
        });
    }

    public getCurrentContracts() {
        return this.generateContractsList();
    }
}
