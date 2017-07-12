import {Component, OnInit} from '@angular/core';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {Connected} from './services/geth-connect/connected';
import {ApiStateService} from './services/api-state/api-state.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public isWeb3Connected: Connected;
    public isAppLoaded = false;
    public currentNodeConnection: { any };
    public retryConnect = 0;

    /**
     *
     * @param {GethConnectService} connectService
     * @param {ApiStateService} apiStateService
     */
    constructor(private connectService: GethConnectService,
                private apiStateService: ApiStateService) {
    }

    loadApp(data) {
        this.currentNodeConnection = data;
    }

    keepAlive() {
        setInterval(() => {
            this.isWeb3Connected = this.connectService.isConnected();
            this.connectService.setConnected(this.isWeb3Connected);
        }, 2000);
    }

    tryReconnect() {
        setTimeout(() => {
            this.retryConnect++;
            this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        }, 2000);
    }

    updateConnectionStatus(data) {
        if (data.isConnected) {
            this.loadApp(data);
            this.keepAlive();
        } else {
            this.tryReconnect();
        }
    }

    onApiServiceWasChanged(apiState) {
        this.isAppLoaded = apiState.isLoaded;
    }

    ngOnInit() {
        this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
        this.apiStateService.setIsApiLoaded({isLoaded: false});
        this.apiStateService.getIsApiLoaded().subscribe(apiState => {
            this.onApiServiceWasChanged(apiState);
        });

    }
}
