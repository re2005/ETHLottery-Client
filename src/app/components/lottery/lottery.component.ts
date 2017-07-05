import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {GethContractService} from '../../services/geth-contract/geth-contract.service';
import {GethConnectService} from '../../services/geth-connect/geth-connect.service';
import {Connected} from '../../services/geth-connect/connected';

@Component({
    selector: 'app-lottery',
    templateUrl: './lottery.component.html',
    styleUrls: ['./lottery.component.scss']
})
export class LotteryComponent implements OnInit {

    private _lottery: any;
    public lotteryAddress: string;
    public lotteryData: any;
    public accounts: Array<any>;
    public isConnected: Connected;
    public playErrorMessage: any;

    /**
     *
     * @param activatedRoute
     * @param {GethContractService} contractService
     * @param {GethConnectService} connectService
     */
    constructor(private activatedRoute: ActivatedRoute,
                private contractService: GethContractService,
                private connectService: GethConnectService) {
    }

    private playSucess(result) {
        this.playErrorMessage = '';
        console.log(result);
    }

    private parsePlayErrorMessage(errorMessage) {
        const userDenied = errorMessage.message.indexOf('User denied transaction signature');
        const unknownAddress = errorMessage.message.indexOf('Unknown address');
        if (userDenied > 0) {
            return String('You need to Acept this request on MetaMask to continue');
        }
        if (unknownAddress > 0) {
            return String('Unknown address, please unlock your account');
        }
    }

    public play() {
        const guess = 'aa';
        const participant = '0x9b7d8Bd164dd966481fdD3B4a6E304e9dF6f25CD';
        const fee = 1;
        const gas = 140000;
        const pass = 'pass';

        // window.web3.personal.unlockAccount(participant, pass);
        // window.web3.personal.lockAccount(participant);

        this._lottery.play(guess, {from: participant, value: fee, gas: gas}, (error, result) => {
            if (error) {
                this.playErrorMessage = this.parsePlayErrorMessage(error);
            }
            this.playSucess(result);
        });
    }

    loadLottery() {
        this._lottery = this.contractService.getContract(this.lotteryAddress);
        this.contractService.getContractData(this._lottery).then(data => {
            this.lotteryData = data;
        });

        this.accounts = this.getAccounts();
    }

    getAccounts() {
        return window.web3.eth.getAccounts((error, accounts) => {
            if (!error) {
                return accounts;
            }
        });
    }

    bootstrap() {
        let isContractLoaded = false;
        this.connectService.getConnected().subscribe(connected => {

            this.isConnected = connected;
            if (connected && !isContractLoaded) {
                this.loadLottery();
                isContractLoaded = !isContractLoaded;
            }
        });
    }

    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            this.lotteryAddress = params['address'];
            this.bootstrap();
        });
    }
}
