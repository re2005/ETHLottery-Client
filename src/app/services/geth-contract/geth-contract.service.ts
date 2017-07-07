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

    private getName() {
        return new Promise((resolve, reject) => {
            // this._contract.name((error, name) => {
            //     if (error) {
            //         reject(error);
            //     }
            //     resolve(name);
            // });
            setTimeout(() => {
                resolve('renatex');
            }, 100)
        });
    }

    public getContractData(contract) {

        this._contract = contract;

        return Promise.all([this.getIsOpen(),
            this.getFee(),
            this.getOwnerFee(),
            this.getTotal(),
            this.getResult(),
            this.getName()
        ]).then(values => {
            return this._contractData = {
                open: values[0],
                fee: values[1],
                ownerFee: values[2],
                total: values[3],
                result: values[4],
                name: values[5],
                address: contract.address
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
