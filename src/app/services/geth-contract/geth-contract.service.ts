'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';


@Injectable()
export class GethContractService {

    private _contract: any;
    private _contractData: Object;

    constructor() {
    }

    public getContractData(contract) {

        this._contract = contract;
        return Promise.all([this.getIsOpen(contract),
            this.getFee(contract),
            this.getOwnerFee(contract),
            this.getTotal(contract),
            this.getResult(contract)]).then(values => {
            return this._contractData = {
                open: values[0],
                fee: values[1],
                ownerFee: values[2],
                total: values[3],
                result: values[4],
                address: contract.address
            };
        });
    }

    getResult(contract) {
        return new Promise((resolve, reject) => {
            contract.result((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }

    getTotal(contract) {
        console.log('total');
        return new Promise((resolve, reject) => {
            contract.total((error, total) => {
                if (error) {
                    reject(error);
                }
                resolve(total);
            });
        });
    }

    getOwnerFee(contract) {
        console.log('owner_fee');
        return new Promise((resolve, reject) => {
            contract.owner_fee((error, owner_fee) => {
                if (error) {
                    reject(error);
                }
                resolve(owner_fee);
            });
        });
    }

    getFee(contract) {
        console.log('fee');
        return new Promise((resolve, reject) => {
            contract.fee((error, fee) => {
                if (error) {
                    reject(error);
                }
                resolve(fee);
            });
        });
    }

    getIsOpen(contract) {
        console.log('open');
        return new Promise((resolve, reject) => {
            contract.open((error, isOpen) => {
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
