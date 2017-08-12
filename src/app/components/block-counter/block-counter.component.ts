import {Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-block-counter',
    templateUrl: './block-counter.component.html',
    styleUrls: ['./block-counter.component.scss']
})
export class BlockCounterComponent implements OnInit {

    @Input() blockNumber: any;
    public waitingLottery: boolean;
    public blockWaiting: number;

    constructor() {
    }

    private updateBlockNumber() {
        const interVal = setInterval(() => {
            window.web3.eth.getBlockNumber((e, result) => {

                const lotteryBlockNumber = this.blockNumber + 20;
                this.blockWaiting = lotteryBlockNumber - result;

                if (this.blockWaiting < 1) {
                    this.waitingLottery = true;
                    clearInterval(interVal);
                }

            });
        }, 2000);
    }

    ngOnInit() {
        this.waitingLottery = false;
        this.blockNumber = parseInt(this.blockNumber, 10);
        this.updateBlockNumber();
    }

}
