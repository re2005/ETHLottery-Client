import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {GethConnectService} from './services/geth-connect/geth-connect.service';
import {GethContractService} from './services/geth-contract/geth-contract.service';
import {GethContractManagerService} from './services/geth-contract-manager/geth-contract-manager.service';
import {StorageService} from './services/storage/storage.service'
import {HttpModule, JsonpModule} from '@angular/http';
import {ApiStateService} from './services/api-state/api-state.service';
import {AccountService} from './services/account/account.service';
import {PlayComponent} from './components/play/play.component';
import {LoadingComponent} from './components/loading/loading.component';
import {PlayService} from './services/play/play.service';
import {IconGeneratorService} from './services/icon-generator/icon-generator.service';
import {LotteryIconComponent} from './components/lottery-icon/lottery-icon.component';
import {ScaleDirective} from './directives/scale.directive';
import {ServerSocketService} from './services/server-socket/server-socket.service';
import {TutorialComponent} from './components/tutorial/tutorial.component';


@NgModule({
    declarations: [
        AppComponent,
        PlayComponent,
        LoadingComponent,
        LotteryIconComponent,
        ScaleDirective,
        TutorialComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
    ],
    providers: [GethConnectService,
        GethContractService,
        GethContractManagerService,
        StorageService,
        ApiStateService,
        AccountService,
        PlayService,
        IconGeneratorService,
        ServerSocketService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
