import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {LotteryComponent} from './components/lottery/lottery.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';
import {GethContractManagerService} from './services/geth-contract-manager/geth-contract-manager.service';
import {ConnectionStatusComponent} from './components/connection-status/connection-status.component';
import {StorageService} from './services/storage/storage.service'
import {HttpModule, JsonpModule} from '@angular/http';
import {ApiStateService} from './services/api-state/api-state.service';
import {AccountService} from './services/account/account.service';

@NgModule({
    declarations: [
        AppComponent,
        LotteryComponent,
        DashboardComponent,
        ConnectionStatusComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        HttpModule,
        JsonpModule,
    ],
    providers: [GethConnectService,
        GethContractService,
        GethContractManagerService,
        StorageService,
        ApiStateService,
        AccountService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
