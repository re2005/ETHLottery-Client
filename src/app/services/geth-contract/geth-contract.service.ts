'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';
import {ContractData} from './contractData';


@Injectable()
export class GethContractService {

    private lottery: any;

    constructor() {
    }

    public getContractData(address) {

        Promise.all([this.getIsOpen, this.getFee]).then(values => {
            console.log(values);
        });

        return new ContractData(
            {
                fee: 2,
                address: address,
                total: 2,
                open: true,
                owner: 'rt',
                result: 'rt',
                isOpen: false
            });
    }


    getTotal() {
        return 203;
    }

    getFee() {
        return new Promise((resolve, reject) => {
            this.lottery.fee((error, fee) => {
                if (error) {
                    reject(error);
                }
                resolve(fee);
            });
        });
    }

    getIsOpen() {
        return new Promise((resolve, reject) => {
            this.lottery.open((error, isOpen) => {
                if (error) {
                    reject(error);
                }
                resolve(isOpen);
            });
        });
    }

    public getContract(contractAddress) {
        return window.web3.eth.contract(abi).at(contractAddress);
    }

}
