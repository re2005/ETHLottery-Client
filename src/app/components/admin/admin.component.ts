import {Component, OnInit, Input} from '@angular/core';
import {ContractManagerService} from '../../services/contract-manager/contract-manager.service';
import {AccountService} from '../../services/account/account.service';
import abi from '../../services/contract/abi';
import code from '../../services/contract/code';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    @Input() playContract: any;


    public accumulate(address) {
        this.playContract.accumulate(address, {
            from: this.playContract.contractData.ownerAddress,
            gas: 2000000
        }, (error, result) => {
            if (!error) {
                console.log(result);
            }
        });
    }


    private deploySuccess(contract) {

        if (contract.address !== undefined) {
            contract.register({
                from: this.playContract.contractData.ownerAddress,
                gas: 2000000
            }, (error, result) => {
                console.log(result);
                if (!error) {
                    if (this.playContract.winners === 0) {
                        this.accumulate(contract.address);
                    }
                }
            });
        }
    }


    public deploy() {
        const data = this.playContract.contractData;
        const newContract = window.web3.eth.contract(abi);
        const accumulate = this.playContract.winners === 0 ? this.playContract.contractData.balance : 0;

        newContract.new(
            data.managerAddress,
            data.fee.toString(10),
            data.jackpot.plus(accumulate).toString(10),
            data.ownerFee.toString(10), {
                from: data.ownerAddress,
                data: code,
                gas: 2000000
            }, (error, result) => {

                if (!error) {
                    this.deploySuccess(result);
                }
            });
    }

    public lotteryManual(tx) {
        this.playContract.manual_lottery(tx, ({from: this.playContract.ownerAddress, gas: 200000}), (error, result) => {
            debugger
        });
    }

    public lottery() {
        this.playContract.lottery(({
                from: this.playContract.ownerAddress,
                gas: 200000
            }
        ), (error, result) => {
            debugger
        });
    }

    public destruct() {
        this.playContract.destruct(({from: this.playContract.ownerAddress, gas: 200000}), (error, result) => {
            debugger
        });
    }

    /**
     *
     * @param {ContractManagerService} _contractManagerService
     * @param {AccountService} _accountService
     */
    constructor(private _contractManagerService: ContractManagerService,
                private _accountService: AccountService) {
    }

    getAccount() {
        return this._accountService.get();
    }

    getManagerOwner() {
        return this._contractManagerService.getOwner()
    }

    public registerContract() {
    }


    ngOnInit() {
    }
}
