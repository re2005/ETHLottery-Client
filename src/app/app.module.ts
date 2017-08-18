import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {KeyValuesPipe} from './key-values.pipe';
import {BrowserModule} from '@angular/platform-browser';
import {PlayService} from './services/play/play.service';
import {PlayComponent} from './components/play/play.component';
import {ConnectService} from './services/connect/connect.service';
import {StorageService} from './services/storage/storage.service';
import {AccountService} from './services/account/account.service';
import {ContractService} from './services/contract/contract.service';
import {LoadingComponent} from './components/loading/loading.component';
import {EtherscanService} from './services/etherscan/etherscan.service';
import {TutorialComponent} from './components/tutorial/tutorial.component';
import {IconGeneratorService} from './services/icon-generator/icon-generator.service';
import {LotteryIconComponent} from './components/lottery-icon/lottery-icon.component';
import {BlockCounterComponent} from './components/block-counter/block-counter.component';
import {ContractManagerService} from './services/contract-manager/contract-manager.service';

@NgModule({
    declarations: [
        AppComponent,
        PlayComponent,
        LoadingComponent,
        LotteryIconComponent,
        TutorialComponent,
        BlockCounterComponent,
        KeyValuesPipe
    ],
    imports: [
        BrowserModule,
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
