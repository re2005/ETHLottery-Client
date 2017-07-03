'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';


@Injectable()
export class GethContractService {

    private _lottery: any;
    private _lotteryData: any;

    constructor() {
    }

    public getContractData(lottery) {

        this._lottery = lottery;

        return Promise.all([this.getIsOpen(),
            this.getFee(),
            this.getOwnerFee(),
            this.getTotal(),
            this.getResult()]).then(values => {
            this._lotteryData = {
                open: values[0],
                fee: values[1],
                ownerFee: values[2],
                total: values[3],
                result: values[4]
            };
            return this._lotteryData;
        });

    }

    getResult() {
        return new Promise((resolve, reject) => {
            this._lottery.result((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    getTotal() {
        console.log('total');
        return new Promise((resolve, reject) => {
            this._lottery.total((error, total) => {
                if (error) {
                    reject(error);
                }
                resolve(total);
            });
        });
    }

    getOwnerFee() {
        console.log('owner_fee');
        return new Promise((resolve, reject) => {
            this._lottery.owner_fee((error, owner_fee) => {
                if (error) {
                    reject(error);
                }
                resolve(owner_fee);
            });
        });
    }

    getFee() {
        console.log('fee');
        return new Promise((resolve, reject) => {
            this._lottery.fee((error, fee) => {
                if (error) {
                    reject(error);
                }
                resolve(fee);
            });
        });
    }

    getIsOpen() {
        console.log('open');
        return new Promise((resolve, reject) => {
            this._lottery.open((error, isOpen) => {
                if (error) {
                    reject(error);
                }
                resolve(isOpen);
            });
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
