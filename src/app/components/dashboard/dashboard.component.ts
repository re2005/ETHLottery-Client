import {Component, OnInit} from '@angular/core';
import {GethConnectService} from '../../services/geth-connect/geth-connect.service';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';
import {GethContractManagerService} from '../../services/geth-contract-manager/geth-contract-manager.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    /**
     *
     * @param gethConnectService
     * @param gethContractService
     * @param gethContractManagerService
     */
    constructor(private gethConnectService: GethConnectService,
                private gethContractService: GethContractService,
                private gethContractManagerService: GethContractManagerService) {
    }

    ngOnInit() {
    }
}

declare global {
    interface Window { Web3: any,web3: any
    }
}
