import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {ConnectService} from './services/connect/connect.service';
import {ContractService} from './services/contract/contract.service';
import {ContractManagerService} from './services/contract-manager/contract-manager.service';
import {StorageService} from './services/storage/storage.service'
import {HttpModule, JsonpModule} from '@angular/http';
import {AccountService} from './services/account/account.service';
import {PlayComponent} from './components/play/play.component';
import {LoadingComponent} from './components/loading/loading.component';
import {PlayService} from './services/play/play.service';
import {IconGeneratorService} from './services/icon-generator/icon-generator.service';
import {LotteryIconComponent} from './components/lottery-icon/lottery-icon.component';
import {TutorialComponent} from './components/tutorial/tutorial.component';
import {FormsModule} from '@angular/forms';
import {EtherscanService} from './services/etherscan/etherscan.service';
import {AdminComponent} from './components/admin/admin.component';

@NgModule({
    declarations: [
        AppComponent,
        PlayComponent,
        LoadingComponent,
        LotteryIconComponent,
        TutorialComponent,
        AdminComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        FormsModule
    ],
    providers: [ConnectService,
        ContractService,
        ContractManagerService,
        StorageService,
        AccountService,
        PlayService,
        IconGeneratorService,
        EtherscanService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
