import {Injectable} from '@angular/core';

@Injectable()
export class GethContractManagerService {

    private _contracts = [
        '0xD256BD72B63645Baf4095493038fbFb6C7eD100A',
        '0x9f13727801463Dc625fb24d15Aa65B7E4D0EC2E7',
        '0x3f47EEB06714e29065f03BD5F69D127A072F1Efd',
        '0x83E90B9bC5929d3403ECB621fC913f3d9A3d1060',
        '0x8451220218F52FdCc4c3f06Ef019ee82c58C37A5',
        '0xD1498F1c4AAafcd1eAA1b6e3594a37C7Fd7D0909',
        '0xE1B5BeaC131Cb9Dd9F783F859939F1BDf8B5857b'
    ];

    constructor() {
    }

    getCurrentContract() {
        return this._contracts;
    }
}
