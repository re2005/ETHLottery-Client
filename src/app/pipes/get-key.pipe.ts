import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'getKey'
})
export class GetKeyPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (!value) {
            return;
        }
        return Object.keys(value).map(key => value[key][args]);
    }
}
