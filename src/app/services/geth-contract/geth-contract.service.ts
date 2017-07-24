'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';
import {GethContractManagerService} from '../../services/geth-contract-manager/geth-contract-manager.service';

@Injectable()
export class GethContractService {

    private _contracts: any;
    private _contract: any;
    private _contractData: Object;

    /**
     *
     * @param {GethContractManagerService} _contractManagerService
     */
    constructor(private _contractManagerService: GethContractManagerService) {
    }

    private getResult() {
        return new Promise((resolve, reject) => {
            this._contract.result((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    private getTotal() {
        return new Promise((resolve, reject) => {
            this._contract.total((error, total) => {
                if (error) {
                    reject(error);
                }
                resolve(total);
            });
        });
    }

    private getOwnerFee() {
        return new Promise((resolve, reject) => {
            this._contract.owner_fee((error, owner_fee) => {
                if (error) {
                    reject(error);
                }
                resolve(owner_fee);
            });
        });
    }

    private getFee() {
        return new Promise((resolve, reject) => {
            this._contract.fee((error, fee) => {
                if (error) {
                    reject(error);
                }
                resolve(fee);
            });
        });
    }

    private getIsOpen() {
        return new Promise((resolve, reject) => {
            this._contract.open((error, isOpen) => {
                if (error) {
                    reject(error);
                }
                resolve(isOpen);
            });
        });
    }

    private getJackpot() {
        return new Promise((resolve, reject) => {
            this._contract.jackpot((error, jackpot) => {
                if (error) {
                    reject(error);
                }
                resolve(jackpot);
            });
        });
    }

    public getContractData(contract) {

        this._contract = contract;

        return Promise.all([
            this.getIsOpen(),
            this.getFee(),
            this.getOwnerFee(),
            this.getTotal(),
            this.getResult(),
            this.getJackpot(),
        ]).then(values => {
            return this._contractData = {
                open: values[0],
                fee: values[1],
                ownerFee: values[2],
                total: values[3],
                result: values[4],
                jackpot: values[5],
                icon: values[6],
                address: contract.address
            };
        });
    }

    public getContractsData() {
        const contractsPromise = [];
        this._contracts.forEach(contract => {
            contractsPromise.push(this.getContractData(contract));
        });
        return new Promise((resolve) => {
            Promise.all(contractsPromise).then(data => {
                for (let _i = 0; _i < data.length; _i++) {
                    this._contracts[_i]['contractData'] = data[_i];
                }
                resolve(this._contracts);
            });
        });
    }

    public get() {
        const that = this;
        this._contracts = [];
        const currentContracts = this._contractManagerService.getCurrentContract();
        return new Promise((resolve) => {
            currentContracts.forEach(contractAddress => {
                const _contract = this._getContractForAddress(contractAddress);
                _contract.address = contractAddress;
                that._contracts.push(_contract);
            });
            this.getContractsData().then(() => {
                resolve(this._contracts);
            });
        });
    }

    /**
     *
     * @param {String} contractAddress
     */
    private _getContractForAddress(contractAddress) {
        return window.web3.eth.contract(abi).at(contractAddress);
    }
}
