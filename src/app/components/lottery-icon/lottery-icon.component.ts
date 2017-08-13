import {Component, OnInit, Input} from '@angular/core';
import {IconGeneratorService} from '../../services/icon-generator/icon-generator.service'

@Component({
    selector: 'app-lottery-icon',
    templateUrl: './lottery-icon.component.html',
    styleUrls: ['./lottery-icon.component.scss']
})

export class LotteryIconComponent implements OnInit {

    @Input() contractAddress: any;
    public iconData: any;

    /**
     *
     * @param {IconGeneratorService} _iconGeneratorService
     */
    constructor(private _iconGeneratorService: IconGeneratorService) {
    }

    ngOnInit() {
        this._iconGeneratorService.generate(this.contractAddress).then((data) => {
            this.iconData = data;
        });
    }
}
