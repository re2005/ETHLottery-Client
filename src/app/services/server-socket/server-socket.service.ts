import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ServerSocketService {

    public messages: Observable<any>;

    constructor() {
    }

    // public connect() {
    //     if (this.messages) {
    //         return;
    //     }
    //
    //     this.messages = websocketConnect(
    //         'ws://socket.etherscan.io/wshandler',
    //         this.inputStream = new QueueingSubject<any>()
    //     ).messages.share()
    // }
    //
    // public send(message: any): void {
    //     this.inputStream.next(message)
    // }

}
