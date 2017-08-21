import {Injectable} from '@angular/core';
import {ConnectService} from '../connect/connect.service';

@Injectable()
export class EtherscanService {

    private network: string;

    /**
     *
     * @param {ConnectService} _connectService
     */
    constructor(private _connectService: ConnectService) {
    }

    /**
     *
     * @param {string} tx
     */
    public openTx(tx) {
        if (!tx) {
            return;
        }
        const network = this._connectService.getNetworkIdSYnc();
        window.open(this.makeEtherScanUrl(network) + 'tx/' + tx, '_blank')
    }

    /**
     *
     * @param {string} address
     */
    public openAddress(address) {
        if (!address) {
            return;
        }
        const network = this._connectService.getNetworkIdSYnc();
        window.open(this.makeEtherScanUrl(network) + 'address/' + address, '_blank')
    }

    /**
     *
     * @param network
     * @return {string}
     */
    private makeEtherScanUrl(network) {
        const etherScanUrl = '//etherscan.io/';
        const etherScanTestNetUrl = '//ropsten.etherscan.io/';
        if (network === '3') {
            return etherScanTestNetUrl;
        } else if (network === '1') {
            return etherScanUrl;
        }
    }

}
