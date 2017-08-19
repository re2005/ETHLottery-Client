import {Injectable} from '@angular/core';
import {StorageService} from '../storage/storage.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlayService {

    private _play: Subject<any> = new Subject<any>();
    private _bets: Subject<any> = new Subject<any>();

    /**
     * @param {StorageService} storageService
     */
    constructor(private storageService: StorageService) {
    }


    broadcastClosePlayWindow(isSuccess): void {
        this._play.next(isSuccess);
    }

    listenClosePlayWindow(): Observable<any> {
        return this._play.asObservable();
    }

    broadcastBetsWasChange(bets): void {
        this._bets.next(bets);
    }

    listenBetsWasChange(): Observable<any> {
        return this._bets.asObservable();
    }

    setBet(account, _bet) {
        let bets = {};
        this.getBets(account).then(data => {
            if (data) {
                bets = data;
            }
            bets[_bet.contractAddress] = bets[_bet.contractAddress] || {};
            bets[_bet.contractAddress][_bet.bet] = _bet;
            this.storageService.set(account, bets);
            this.broadcastBetsWasChange(bets);
        });
    }

    getBets(account) {
        return this.storageService.get(account);
    }

    updateBets(account, bets) {
        this.storageService.set(account, bets).then(() => {
            this.broadcastBetsWasChange(bets);
        });
    }
}
