import {Component, OnInit, Input} from '@angular/core';
import {PlayService} from '../../services/play/play.service';
import _ from 'lodash';

@Component({
    selector: 'app-play',
    templateUrl: './play.component.html',
    styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

    @Input() play: any;
    public isBetInvalid: boolean;
    public bets = ['a', 'b', 'c', 'd', 'e', 'f', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    public playSuccessMessage: any;

    /**
     * @param {PlayService} _playService
     */
    constructor(private _playService: PlayService) {
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
        errorMessage = this._cleanErrorMessage(errorMessage);
        alert(errorMessage);
    }

    /**
     *
     * @param {Object} bet
     */
    onPlaySuccess(bet) {
        this._playService.setBet(this.play.account, bet);
        this.playSuccessMessage = 'Uhuuuu Bets made!';
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
            if (error) {
                this.onPlayError(error);
            } else {
                bet.transactionHash = result;
                this.onPlaySuccess(bet);
            }
        });
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

        if (!this.play.account) {
            alert('You are not able to play until you unlock your account on META MASK and refresh the page');
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
            transactionHash: null,
            index: this.play._index
        };

        this.isBetDuplicated(_bet).then(isDuplicated => {
            if (isDuplicated) {
                alert('You have this bet ;)');
            } else {
                this._makeBet(_bet);
            }
        });
    }


    ngOnInit() {
    }

}
