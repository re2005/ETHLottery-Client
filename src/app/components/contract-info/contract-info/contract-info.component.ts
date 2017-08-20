import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {ContractService} from '../../../services/contract/contract.service';
import {PlayService} from '../../../services/play/play.service';


@Component({
    selector: 'app-contract-info',
    templateUrl: './contract-info.component.html',
    styleUrls: ['./contract-info.component.scss']
})
export class ContractInfoComponent implements OnInit {

    @Input() contractAddress: any;
    public address: any;
    public contractData: any;

    constructor(private _contractService: ContractService,
                private _playService: PlayService) {
    }

    public removeBets(address) {
        const confirmation = prompt('Are you sure?\nThis will remove all bets from this lottery.\nTo confirm please write "delete":', '');
        if (confirmation === 'delete') {
            window.web3.eth.getAccounts((error, accounts: any) => {
                if (!error) {
                    this._playService.getBets(accounts[0]).then(bets => {
                        delete bets[address];
                        this._playService.updateBets(accounts[0], bets);
                    });
                }
            });
        }
    }

    public calculateCurrentBets(balance, fee) {
        return Math.floor(balance / fee);
    }

    public calculateTotalBets(jackpot, fee) {
        return Math.ceil(jackpot / fee);
    }

    public play() {
    }

    ngOnInit() {
        this.address = this.contractAddress.split(',')[0];
        this._contractService.listenContracts().subscribe(data => {
            if (!data[this.address]) return;
            this.contractData = data[this.address].contractData;
        });
    }

    ngOnChanges(changes) {
        this.address = this.contractAddress.split(',')[0];
        if (changes['contractAddress']) {
            const contracts = this._contractService.getContracts();
            if (Object.keys(contracts).length > 1) {
                if (!contracts[this.address]) return;
                this.contractData = contracts[this.address].contractData;
            }
        }
    }
}
