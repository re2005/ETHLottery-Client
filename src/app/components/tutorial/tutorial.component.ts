import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';

@Component({
    selector: 'app-tutorial',
    templateUrl: './tutorial.component.html',
    styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

    public isTutorialOpen = false;
    public currentStep = 0;

    /**
     *
     * @param {StorageService} _storageService
     */
    constructor(private _storageService: StorageService) {
    }

    public previousStep() {
        if (this.currentStep > 0) {
            this.currentStep = this.currentStep - 1;
        }
    }


    public nextStep() {
        this.currentStep++;
        if (this.currentStep > 2) {
            this._close();
        }
    }

    public skip() {
        this._close();
    }

    private _close() {
        this._storageService.set('tutorial', 0).then(confirm => {
            this.isTutorialOpen = false;
        });
    }

    private _updateTutorialState(tutorial) {
        if (tutorial === null) {
            this.isTutorialOpen = true;

        }
    }

    ngOnInit() {
        this._storageService.get('tutorial').then(tutorialData => {
            this._updateTutorialState(tutorialData);
        });
    }

}
