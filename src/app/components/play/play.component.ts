import {Component, OnInit, Input} from '@angular/core';
import {AccountService} from '../../services/account/account.service';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    @Input() play: any;

    /**
     * @param accountService
     * @param {GethContractService} contractService
     */
    constructor(private accountService: AccountService,
                private contractService: GethContractService) {
    }

    public playBet() {
        const bet1 = 'a';
        const bet2 = 'a';
        const gas = 4400000;
        //21000

        // if (bet1 === '$' || bet2 === '$') {
        //     this.isBetValid = true;
        //     return;
        // }
        const _bet = bet1 + bet2;
        const account = this.accountService.getAccount();
        // this.isBetValid = false;
        this.play.contractBets = [];

        this.play.contractBets.push({
            address: '0x00000001',
            bet: 'av',
            timestamp: '1213131231231231'
        });

        this.contractService.setContractObservable(this.play);

        // this.play.play(_bet, {from: account, value: this.play.contractData.fee, gas: gas}, (error, result) => {
        //     if (error) {
        //         console.log(error);
        //         // this.playErrorMessage = this.onPlayError(error);
        //     } else {
        //         console.log(result);
        //         // this.onPlaySuccess(result, _bet);
        //     }
        // });
    }


    ngOnInit() {
        console.log(this.play);
    }

}
