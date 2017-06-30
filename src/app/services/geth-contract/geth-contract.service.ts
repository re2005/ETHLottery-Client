'use strict';
import {Injectable} from '@angular/core';
import abi from './abi';


@Injectable()
export class GethContractService {

    constructor() {
    }

    getContract(contractAddress) {
        return window.web3.eth.contract(abi).at(contractAddress);
    }

}
