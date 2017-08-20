import {Injectable} from '@angular/core';

@Injectable()
export class BetsService {

    constructor() {
    }

    public makeBet(betConfig) {
        return {
            gas: 2000000,
            bet: betConfig.bet,
            fee: betConfig.fee,
            account: betConfig.accountAddress,
            timestamp: Date.now(),
            contractAddress: betConfig.contractAddress,
            isConfirmed: false,
            isWinner: false,
            isLooser: false,
            isInvalid: false,
            withdrawHash: false,
            transactionHash: null,
            withdrawConfirmed: null
        };
    }

    public makeRestoredBet(betConfig) {
        return {
            bet: betConfig.bet,
            account: betConfig.accountAddress,
            contractAddress: betConfig.contractAddress
        };
    }
}
