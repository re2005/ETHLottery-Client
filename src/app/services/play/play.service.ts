import {Injectable} from '@angular/core';
import {StorageService} from '../storage/storage.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PlayService {

    private _play: Subject<any> = new Subject<any>();
    private _bets: Subject<any> = new Subject<any>();
    private _betsData: any;

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

    broadcastBetsWasChange(): void {
        this._bets.next();
    }

    listenBetsWasChange(): Observable<any> {
        return this._bets.asObservable();
    }

    setBet(account, _bet) {
        this._betsData = [];
        this.getBets(account).then(data => {
            if (data) {
                this._betsData = data;
            }
            this._betsData.unshift(_bet);
            this.storageService.set(account, this._betsData);
            this.broadcastBetsWasChange();
        });
    }

    getBets(account) {
        return this.storageService.get(account);
    }

    updateBets(account, bets) {
        this.storageService.set(account, bets).then(() => {
            this.broadcastBetsWasChange();
        });

    }

}
