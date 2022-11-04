import {Component, OnInit, Input} from '@angular/core';


@Component({
    selector: 'app-block-counter',
    templateUrl: './block-counter.component.html',
    styleUrls: ['./block-counter.component.scss']
})
export class BlockCounterComponent implements OnInit {

    @Input() resultBlock: any;
    public waitingLottery: boolean;
    public blockWaiting: number;
    private lotteryResultBlock: number;

    constructor() {
    }

    private updateResultBlock() {
        this.lotteryResultBlock = parseInt(this.resultBlock, 10) + 10;

        const interVal = setInterval(() => {
            if (this.resultBlock === 0) {
                return;
            }
            window.ethereum.eth.getBlockNumber((error, result) => {
                if (error) {
                    return;
                }
                this.blockWaiting = this.lotteryResultBlock - result;
                if (this.blockWaiting < 1) {
                    this.waitingLottery = true;
                    clearInterval(interVal);
                }

            });
        }, 2000);
    }

    ngOnInit() {
        this.waitingLottery = false;
        this.resultBlock = parseInt(this.resultBlock, 10);
        this.updateResultBlock();
    }

}


declare global {
    interface Window {
        Web3: any,
        web3: any,
        ga: any
    }
}
