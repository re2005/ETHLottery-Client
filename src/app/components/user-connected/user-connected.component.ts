import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-user-connected',
    templateUrl: './user-connected.component.html',
    styleUrls: ['./user-connected.component.scss']
})
export class UserConnectedComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
        console.log('re');
    }

}
