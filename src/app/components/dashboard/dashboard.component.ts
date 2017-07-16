import {Component, OnDestroy, OnInit} from '@angular/core';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';
import {GethConnectService} from '../../services/geth-connect/geth-connect.service';
import {Connected} from '../../services/geth-connect/connected';
import {ApiStateService} from '../../services/api-state/api-state.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

    public contractsData: any;
    public isConnected: Connected;
    private getConnectedListener: any;
    public isLoading = true;

    /**
     * @param {GethContractService} contractService
     * @param {GethConnectService} connectService
     * @param {ApiStateService} apiStateService
     */
    constructor(private contractService: GethContractService,
                private connectService: GethConnectService,
                private apiStateService: ApiStateService) {
    }

    public openLottery(address) {
        this._getLotteryByAddress(address);
    }

    private _getLotteryByAddress(address) {
        this.contractsData.forEach(contract => {
            if (address === contract.address) {

            }
        })
    }

    updateContractAllEvents(event) {

        this.contractsData.forEach(contract => {

            if (!contract.contractEvents) {
                contract.contractEvents = [];
            }
            if (event.address.toLowerCase() === contract.address.toLowerCase()) {
                contract.contractEvents.push(event);
                if (event.event === 'Total') {
                    contract.contractData.total = event.args.total;
                }
                if (event.event === 'Open') {
                    contract.contractData.open = event.args.open;
                }
                if (event.event === 'Result') {
                    contract.contractData.result = event.args.result;
                }
            }
        })
    }

    public refreshList() {
        // this.contractsData = [];
        // this.isLoading = true;
        // this._loadContractData();
    }

    bootstrap() {
        this.contractService.getEvents().subscribe(contractsEvents => {
            this.updateContractAllEvents(contractsEvents)
        });

        this.contractService.getContractsData().then((data) => {
            this.contractsData = data;
            this.apiStateService.setIsApiLoaded({isLoaded: true});
            this.isLoading = false;
        });
    }

    ngOnInit() {
        this.apiStateService.setIsApiLoaded({isLoaded: false});
        let isContractLoaded = false;
        this.getConnectedListener = this.connectService.getConnected().subscribe(connected => {
            this.isConnected = connected;
            if (connected && !isContractLoaded) {
                this.bootstrap();
                isContractLoaded = !isContractLoaded;
            }
        });
    }

    ngOnDestroy() {
        this.getConnectedListener.unsubscribe();
    }
}

declare global {
    interface Window { Web3: any, web3: any
    }
}
