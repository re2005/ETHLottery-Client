import {Injectable} from '@angular/core';

@Injectable()
export class EtherscanService {


    constructor() {
    }

    private getNetwork() {
        return new Promise((resolve) => {
            window.web3.version.getNetwork((err, netId) => {
                if (!err) {
                    resolve(netId);
                }
            });
        });
    }

    /**
     *
     * @param {string} tx
     */
    public openTx(tx) {
        if (!tx) {
            return;
        }
        this.getNetwork().then(network => {
            window.open(this.makeEtherScanUrl(network) + 'tx/' + tx, '_blank')
        });
    }

    /**
     *
     * @param {string} address
     */
    public openAddress(address) {
        if (!address) {
            return;
        }
        this.getNetwork().then(network => {
            window.open(this.makeEtherScanUrl(network) + 'address/' + address, '_blank')
        });
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
