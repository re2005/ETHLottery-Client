import {Component, OnInit} from '@angular/core';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';
import {GethContractManagerService} from '../../services/geth-contract-manager/geth-contract-manager.service';
import {GethConnectService} from '../../services/geth-connect/geth-connect.service';
import {Connected} from '../../services/geth-connect/connected';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public contracts = [];
    public isConnected: Connected;

    /**
     * @param {GethContractService} contractService
     * @param {GethContractManagerService} contractManagerService
     * @param {GethConnectService} connectService
     */
    constructor(private contractService: GethContractService,
                private contractManagerService: GethContractManagerService,
                private connectService: GethConnectService) {
    }

    private _loadContractData(contracts) {

        const contractsPromise = [];
        contracts.forEach(contract => {
            contractsPromise.push(this.contractService.getContractData(contract));
        });

        Promise.all(contractsPromise).then(data => {
            this.contracts = data;
        });
    }

    private _getContracts() {

        const currentContracts = this.contractManagerService.getCurrentContract();
        return new Promise((resolve) => {
            currentContracts.forEach(contractAddress => {
                const _contract = this.contractService.getContract(contractAddress);
                _contract.address = contractAddress;
                this.contracts.push(_contract);
            });
            resolve(this.contracts);
        });
    }

    bootstrap() {
        this._getContracts().then(contracts => {
            this._loadContractData(contracts);
        });
    }

    ngOnInit() {
        let isContractLoaded = false;
        this.connectService.getConnected().subscribe(connected => {
            this.isConnected = connected;
            if (connected && !isContractLoaded) {
                this.bootstrap();
                isContractLoaded = !isContractLoaded;
            }
        });
    }
}

declare global {
    interface Window { Web3: any, web3: any
    }
}
