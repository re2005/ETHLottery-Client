'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';
import {ContractManagerService} from '../../services/contract-manager/contract-manager.service';

@Injectable()
export class ContractService {

    private _contracts: any;
    private _contract: any;
    private _contractData: Object;

    /**
     *
     * @param {ContractManagerService} _contractManagerService
     */
    constructor(private _contractManagerService: ContractManagerService) {
    }


    /**
     *
     * @param value
     * @return {number}
     */
    public convertWeiToEther(value) {
        return window.web3.fromWei(value, 'ether')
    }

    /**
     *
     * @param jackpot
     * @param ownerFee
     * @return {number}
     */
    private calculateJackpot(jackpot, ownerFee) {
        if (ownerFee.c[0] === 0) {
            return jackpot;
        }
        return this.convertWeiToEther(jackpot) - (this.convertWeiToEther(jackpot) * ownerFee / 100);
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

    public getBalance() {

        return new Promise((resolve) => {

            window.web3.eth.getBalance(this._contract.address, (error, balance) => {
                if (!error) {
                    resolve(balance);
                } else {
                    console.error('Error getting balance for account: ' + this._contract.address)
                }
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


    private getName() {
        return new Promise((resolve, reject) => {
            this._contract.name((error, name) => {
                if (error) {
                    reject(error);
                }
                resolve(name);
            });
        });
    }

    private getResultHash() {
        return new Promise((resolve, reject) => {
            this._contract.result_hash((error, resultHash) => {
                if (error) {
                    reject(error);
                }
                resolve(resultHash);
            });
        });
    }

    private getResultBlock() {
        return new Promise((resolve, reject) => {
            this._contract.result_block((error, resultBlock) => {
                if (error) {
                    reject(error);
                }
                resolve(resultBlock);
            });
        });
    }

    public getContractData(contract) {

        // TODO This here sounds ODD or we have to pass the contrat into every method bellow
        this._contract = contract;

        return Promise.all([
            this.getIsOpen(),
            this.getFee(),
            this.getOwnerFee(),
            this.getTotal(),
            this.getResult(),
            this.getJackpot(),
            this.getName(),
            this.getResultHash(),
            this.getResultBlock(),
            this.getBalance()
        ]).then(values => {
            return this._contractData = {
                open: values[0],
                fee: values[1],
                ownerFee: values[2],
                total: values[3],
                result: values[4],
                jackpot: values[5],
                name: values[6],
                resultHash: values[7],
                resultBlock: values[8],
                balance: values[9],
                address: contract.address
            };
        });
    }

    private calculateScale(total, jackpot) {
        const size = total ? 1 * total / jackpot : 0;
        const scale = 1 + size;
        return 'scale(' + scale + ')';
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
                    this._contracts[_i].contractData.scale = this.calculateScale(this._contracts[_i]['contractData'].total, this._contracts[_i]['contractData'].jackpot);
                    this._contracts[_i].contractData.jackpotCalculated = this.calculateJackpot(this._contracts[_i].contractData.jackpot, this._contracts[_i].contractData.ownerFee);
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
