import {Component, OnInit} from '@angular/core';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {Connected} from './services/geth-connect/connected';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

    public isWeb3Connected: Connected;
    public isAppLoaded = false;
    public currentNodeConnection: string;
    public retryConnect = 0;


    /**
     *
     * @param {GethConnectService} connectService
     */
    constructor(private connectService: GethConnectService) {
    }

    loadApp(data) {
        this.isAppLoaded = data.isConnected;
        this.currentNodeConnection = data.server;
    }

    keepAlive() {
        setInterval(() => {
            this.isWeb3Connected = this.connectService.isConnected();
            this.connectService.setConnected(this.isWeb3Connected);
        }, 1000);
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

    ngOnInit() {
        this.connectService.startConnection().then((data) => this.updateConnectionStatus(data));
    }
}
