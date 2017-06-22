import {Component, OnInit} from '@angular/core';
import {GethConnectService} from '../../services/geth-connect/geth-connect.service';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';
import {GethContractManagerService} from '../../services/geth-contract-manager/geth-contract-manager.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    _contract: any;
    _isWeb3Connected: boolean;
    _currentNodeConnection: string;

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

    updateConnectionStatus(data) {

        if (data.connection) {
            const currentContract = this.gethContractManagerService.getCurrentContract();
            this._contract = this.gethContractService.getContract(currentContract);
            this._isWeb3Connected = true;
            this._currentNodeConnection = data.server;
        } else {
            this._isWeb3Connected = false;
        }
    }



    ngOnInit() {
        this.gethConnectService.startConnection().then((data) => this.updateConnectionStatus(data));
    }

}
