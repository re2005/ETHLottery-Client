'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';


@Injectable()
export class GethContractService {

    private _contract: any;
    private _contractData: Object;

    constructor() {
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
        console.log('total');
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
        console.log('owner_fee');
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
        console.log('fee');
        return new Promise((resolve, reject) => {
            this._contract.fee((error, fee) => {
                if (error) {
                    reject(error);
                }
                resolve(fee);
            });
        });
    }

    private getIsOpenEvent() {
        return new Promise((resolve, reject) => {
            this._contract.Open((error, isOpen) => {
                if (error) {
                    reject(error);
                }
                resolve(isOpen);
            });
        });
    }

    private getIsOpen() {
        console.log('open');
        return new Promise((resolve, reject) => {
            this._contract.open((error, isOpen) => {
                if (error) {
                    reject(error);
                }
                resolve(isOpen);
            });
        });
    }

    public getContractData(contract) {

        this._contract = contract;

        return Promise.all([this.getIsOpen(),
            this.getFee(),
            this.getOwnerFee(),
            this.getTotal(),
            this.getResult()]).then(values => {
            return this._contractData = {
                // open: values[0],
                // fee: values[1],
                // ownerFee: values[2],
                // total: values[3],
                // result: values[4],
                // address: this._contract.address
                Open: this.getIsOpenEvent(),
                open: true,
                fee: 0.1,
                ownerFee: 2,
                total: 4.4,
                result: null,
                address: this._contract.address,
                jackpot: 10,
                type: 1,
            };
        });
    }

    /**
     *
     * @param {String} contractAddress
     */
    public getContract(contractAddress) {
        return window.web3.eth.contract(abi).at(contractAddress);
    }
}
