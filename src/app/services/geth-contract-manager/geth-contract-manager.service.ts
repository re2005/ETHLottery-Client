import {Injectable} from '@angular/core';

@Injectable()
export class GethContractManagerService {

    private _contracts = [
        '0x077321dD767ea9182C17bC2E0A6aE32642A91dbb',
        '0x817a5B1cd7EA408b0f4898ba79E2AAA15F4EB792',
        '0x022Ddd4FaaFa3d4b2d1Dd0e42e1BfAe460c5fE82',
        '0xE0CBBD50F78B244A7f8A6eA95991dFa8978d7D8e',
        '0xe8f2A26C0faeeDe9b0DA6E3D2eC1Db1b4c2002a5',
        '0x3f47EEB06714e29065f03BD5F69D127A072F1Efd',
        '0x34eE57aB182a52dC5D0daa3a950B8C060b501bb4',
        '0xC34d6eB9F406A356510491A80F098194A677F734',
        '0x5E9b827A73059e2cF1aCFBBfB0e840d533becF31',
        '0x97D32d79879a94918AD2ab8315896BdeDfc319Fd',
        '0xA7707d35e31661D28835290DE1DDd25a8F439A99',
        '0xaa2179259BaAf3229EF598306306bf6b8A38ec52',
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
