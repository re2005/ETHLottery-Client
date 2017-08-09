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


    private getOwnerAddress() {
        return new Promise((resolve, reject) => {
            this._contract.owner((error, owner) => {
                if (error) {
                    reject(error);
                }
                resolve(owner);
            });
        });
    }

    private getManagerAddress() {
        return new Promise((resolve, reject) => {
            this._contract.manager_address((error, owner) => {
                if (error) {
                    reject(error);
                }
                resolve(owner);
            });
        });
    }

    private getWinnersCount() {
        return new Promise((resolve, reject) => {
            this._contract.winners_count((error, winners) => {
                if (error) {
                    reject(error);
                }
                resolve(winners);
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
            this.getResult(),
            this.getJackpot(),
            this.getName(),
            this.getResultHash(),
            this.getResultBlock(),
            this.getBalance(),
            this.getOwnerAddress(),
            this.getManagerAddress(),
            this.getWinnersCount()
        ]).then(values => {
            return this._contractData = {
                open: values[0],
                fee: values[1],
                ownerFee: values[2],
                result: values[3],
                jackpot: values[4],
                name: values[5],
                resultHash: values[6],
                resultBlock: values[7],
                balance: values[8],
                ownerAddress: values[9],
                managerAddress: values[10],
                winners: values[11],
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
                    this._contracts[_i].contractData.scale = this.calculateScale(this._contracts[_i]['contractData'].balance, this._contracts[_i]['contractData'].jackpot);
                    this._contracts[_i].contractData.jackpotCalculated = this.calculateJackpot(this._contracts[_i].contractData.jackpot, this._contracts[_i].contractData.ownerFee);
                }
                resolve(this._contracts);
            });
        });
    }

    public get() {
        const that = this;
        this._contracts = [];
        let _contractsArray: any;
        return new Promise((resolve) => {
            this._contractManagerService.getCurrentContracts().then(contractsArray => {
                _contractsArray = contractsArray;
                _contractsArray.forEach(contractAddress => {
                    const _contract = this._getContractForAddress(contractAddress);
                    _contract.address = contractAddress;
                    that._contracts.push(_contract);
                });
                this.getContractsData().then(() => {
                    resolve(this._contracts);
                });
            });
        });
    }

    /**
     *
     * @param {string} address
     */
    public register(_contract) {
        return new Promise(resolve => {
            _contract.Register((error, result) => {
                if (!error) {
                    console.log(result);
                    resolve(result);
                } else {
                    console.error(error);
                }
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
