import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';
import {GethConnectService} from '../../services/geth-connect/geth-connect.service';

@Component({
    selector: 'app-user-connected',
    templateUrl: './user-connected.component.html',
    styleUrls: ['./user-connected.component.scss']
})
export class UserConnectedComponent implements OnInit {

    private address: string;
    public lotteryData: any;
    public accounts: Array<any>;

    /**
     *
     * @param activatedRoute
     * @param {GethContractService} contractService
     * @param {GethConnectService} connectService
     */
    constructor(private activatedRoute: ActivatedRoute,
                private contractService: GethContractService,
                private connectService: GethConnectService) {
    }


    loadLottery() {
        this.lotteryData = this.contractService.getContractData(this.address);
        console.log(this.lotteryData);
        this.accounts = this.getAccounts();
    }

    getAccounts() {
        return window.web3.eth.getAccounts((error, accounts) => {
            if (!error) {
                console.log(accounts);
                return accounts;
            }
        });
    }

    bootstrap() {
        let isContractLoaded = false;
        this.connectService.getConnected().subscribe(connected => {
            if (connected && !isContractLoaded) {
                this.loadLottery();
                isContractLoaded = !isContractLoaded;
            }
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.address = params['address'];
            this.bootstrap();
        });

    }
}
