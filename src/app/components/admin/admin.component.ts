import {Component, OnInit} from '@angular/core';
import {ContractManagerService} from '../../services/contract-manager/contract-manager.service';
import {AccountService} from '../../services/account/account.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

    public isOwner = false;

    /**
     *
     * @param {ContractManagerService} _contractManagerService
     * @param {AccountService} _accountService
     */
    constructor(private _contractManagerService: ContractManagerService,
                private _accountService: AccountService) {
    }

    getIsOwner(managerOwner) {
        this._accountService.get().then(account => {
            // debugger
        });
        // return true
        // return this.isOwner;
    }

    public registerContract(address) {

        this._contractManagerService.register(address).then(result => {
            debugger
        });
    }

    ngOnInit() {
        this._contractManagerService.getOwner().then(managerOwner => {
            // this.isOwner = this.getIsOwner(managerOwner);
        });
    }

}
