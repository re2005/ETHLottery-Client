import {Component, OnInit, Input, OnChanges} from '@angular/core';
import {PlayService} from '../../services/play/play.service';
import {AccountService} from '../../services/account/account.service';
import {EtherscanService} from '../../services/etherscan/etherscan.service';
import {ContractService} from '../../services/contract/contract.service';
import _ from 'lodash';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    @Input() play: any;
    public isBetInvalid: boolean;
    public playErrorMessage: any;
    public bets = ['a', 'b', 'c', 'd', 'e', 'f', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    public bet_1 = '$';
    public bet_2 = '$';

    /**
     * @param {PlayService} _playService
     * @param {AccountService} _accountService
     * @param {ContractService} _contractService
     */
    constructor(private _playService: PlayService,
                private _accountService: AccountService,
                private _etherscanService: EtherscanService,
                private _contractService: ContractService) {
    }


    public openAddress(address) {
        this._etherscanService.openAddress(address);
    }

    /**
     *
     * @param errorMessage
     * @return {string}
     * @private
     */
    private _cleanErrorMessage(errorMessage) {
        const userDenied = errorMessage.message.indexOf('User denied transaction signature');
        const unknownAddress = errorMessage.message.indexOf('Unknown address');
        if (userDenied > 0) {
            return String('You need to ACCEPT the payment request on MetaMask to continue');
        } else if (unknownAddress > 0) {
            return String('Unknown address, please unlock your account on MetaMask');
        } else {
            return ('Error message: ' + errorMessage.message);
        }
    }

    private isBetDuplicated(currentBet) {
        return new Promise((resolve) => {
            let isDuplicated;
            this._playService.getBets(this.play.account).then(bets => {
                if (!bets) {
                    resolve(false);
                    return;
                }
                _.some(bets, bet => {
                    const isSameAddress = currentBet.contractAddress.toLowerCase() === bet.contractAddress.toLowerCase();
                    const isSameBet = currentBet.bet === bet.bet;
                    isDuplicated = (isSameAddress && isSameBet);
                    return isDuplicated;
                });
                resolve(isDuplicated);
            });
        });
    }

    /**
     *
     * @param errorMessage
     */
    onPlayError(errorMessage) {
        this.playErrorMessage = this._cleanErrorMessage(errorMessage);
    }

    /**
     *
     * @param {Object} bet
     */
    onPlaySuccess(bet) {
        this._playService.setBet(this.play.account, bet);

        window.ga('send', {
            hitType: 'event',
            eventCategory: bet.contractAddress,
            eventAction: 'Bet',
            eventLabel: bet.bet
        });
        this.clearBet();
    }

    private clearBet() {
        this.bet_1 = '$';
        this.bet_2 = '$';
    }

    /**
     *
     * @param bet
     * @private
     */
    private _makeBet(bet) {
        this.play.play(bet.bet, {
            from: bet.account,
            value: this.play.contractData.fee,
            gas: bet.gas
        }, (error, result) => {
            if (!error) {
                bet.transactionHash = result;
                this.onPlaySuccess(bet);
                this._playService.broadcastClosePlayWindow(true);
            } else {
                this.onPlayError(error);
            }
        });
    }

    public close() {
        this.isBetInvalid = false;
        this.playErrorMessage = null;
        this.clearBet();
        this._playService.broadcastClosePlayWindow(false);
    }

    /**
     *
     * @param bet1
     * @param bet2
     */
    public playBet(bet1, bet2) {

        if (bet1 === '$' || bet2 === '$') {
            this.isBetInvalid = true;
            return;
        }
        this.isBetInvalid = false;

        if (!this.play.account) {
            this.playErrorMessage = 'Please unlock META MASK';
            return;
        }

        this.isBetInvalid = false;

        const _bet = {
            gas: 2000000,
            bet: '0x' + bet1 + bet2,
            fee: this.play.contractData.fee,
            account: this.play.account,
            timestamp: Date.now(),
            contractAddress: this.play.address,
            isConfirmed: false,
            isWinner: false,
            isInvalid: false,
            withdrawHash: false,
            transactionHash: null
        };

        this.isBetDuplicated(_bet).then(isDuplicated => {
            if (isDuplicated) {
                this.playErrorMessage = 'You have this bet ;)';
            } else {
                this.playErrorMessage = null;
                this._makeBet(_bet);
            }
        });
    }

    convertWeiToEther(value) {
        return this._contractService.convertWeiToEther(value);
    }

    ngOnInit() {
        this._accountService.getAccount().subscribe((account) => {
            if (account && this.play) {
                this.play.account = account;
                this.playErrorMessage = null;
            }
        });
    }

    ngOnChanges(changes) {
        if (changes['play'] && this.play) {
            this.play.contractData.feeConverted = this.convertWeiToEther(this.play.contractData.fee);
        }
    }

}
