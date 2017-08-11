import {Injectable} from '@angular/core';
import {abiManager} from './abi-manager';

@Injectable()
export class ContractManagerService {

    private managerAddress = '0x450fa40f5537c34f1f5cfbb8329289e0a0299733';
    private managerData: any;

    constructor() {
    }

    /**
     *
     * @param {String} contractAddress
     */
    private _getContractForAddress(contractAddress) {
        return window.web3.eth.contract(abiManager).at(contractAddress);
    }

    public getOwner() {
        if (!this.managerData) {
            this.managerData = this._getContractForAddress(this.managerAddress);
        }
        return new Promise(resolve => {
            this.managerData.owner((error, owner) => {
                resolve(owner);
            });
        });
    }

    private getLotteries() {
        if (!this.managerData) {
            this.managerData = this._getContractForAddress(this.managerAddress);
        }
        return new Promise(resolve => {
            this.managerData.lotteries((error, lotteries) => {
                resolve(lotteries);
            });
        });
    }

    private generateContractsList() {
        return new Promise(resolve => {
            this.managerData = this._getContractForAddress(this.managerAddress);
            this.getLotteries().then(lotteries => {
                resolve(lotteries);
            });
        });
    }

    public getCurrentContracts() {
        return this.generateContractsList();
    }
}
