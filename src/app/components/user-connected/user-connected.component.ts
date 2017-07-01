import {Component, OnInit} from '@angular/core';

import {Router, ActivatedRoute, Params} from '@angular/router';


@Component({
    selector: 'app-user-connected',
    templateUrl: './user-connected.component.html',
    styleUrls: ['./user-connected.component.scss']
})
export class UserConnectedComponent implements OnInit {

    constructor(private activatedRoute: ActivatedRoute) {
    }


    ngOnInit() {
        this.activatedRoute.params.subscribe((params: Params) => {
            const id = params['id'];
            console.log(id);
        });
    }

}
