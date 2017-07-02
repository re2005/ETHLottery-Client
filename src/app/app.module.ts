import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {UserConnectedComponent} from './components/user-connected/user-connected.component';
import {AppRoutingModule} from './app-routing.module';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';
import {GethContractManagerService} from './services/geth-contract-manager/geth-contract-manager.service';
import {ConnectionStatusComponent} from './components/connection-status/connection-status.component';


@NgModule({
    declarations: [
        AppComponent,
        UserConnectedComponent,
        DashboardComponent,
        ConnectionStatusComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule
    ],
    providers: [GethConnectService,
        GethContractService,
        GethContractManagerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
